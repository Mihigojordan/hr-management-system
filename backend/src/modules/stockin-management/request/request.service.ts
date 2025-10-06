// src/request/request.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestStatus, MovementType, SourceType, Prisma } from 'generated/prisma';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async createRequest(data: {
    siteId: string;
    requestedByAdminId?: string;
    requestedByEmployeeId?: string;
    notes?: string;
    items: Array<{
      stockInId: string;
      qtyRequested: number;
    }>;
  }) {
    // Verify site exists
    const site = await this.prisma.site.findUnique({
      where: { id: data.siteId },
    });

    if (!site) {
      throw new BadRequestException('Invalid site ID');
    }

    // Generate unique ref_no
    const refNo = await this.generateRefNo();

    // Create request with items
    const request = await this.prisma.request.create({
      data: {
        ref_no: refNo,
        siteId: data.siteId,
        requestedByAdminId: data.requestedByAdminId,
        requestedByEmployeeId: data.requestedByEmployeeId,
        notes: data.notes,
        status: RequestStatus.PENDING,
        requestItems: {
          create: data.items.map(item => ({
            stockInId: item.stockInId,
            qtyRequested: new Decimal(item.qtyRequested),
            qtyRemaining: new Decimal(item.qtyRequested),
          })),
        },
      },
      include: {
        site: true,
        requestedByAdmin: true,
        requestedByEmployee: true,
        requestItems: {
          include: {
            stockIn: {
              include: {
                stockcategory: true,
                store: true,
              },
            },
          },
        },
      },
    });

    return request;
  }

async approveRequest(
    requestId: string,
    data: {
      approvedByAdminId?: string;
      approvedByEmployeeId?: string;
      itemModifications?: Array<{
        requestItemId: string;
        qtyRequested?: number;
        qtyApproved?: number;
        stockInId?: string;
      }>;
      itemsToAdd?: Array<{
        stockInId: string;
        qtyRequested: number;
        qtyApproved?: number;
      }>;
      itemsToRemove?: string[]; // array of requestItem IDs
      comment?: string;
    },
  ) {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: { requestItems: true },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be approved');
    }

    // Start a transaction
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Remove items
      if (data.itemsToRemove && data.itemsToRemove.length > 0) {
        await tx.requestItem.deleteMany({
          where: { id: { in: data.itemsToRemove } },
        });
      }

      // 2️⃣ Add new items
      if (data.itemsToAdd && data.itemsToAdd.length > 0) {
        for (const item of data.itemsToAdd) {
          await tx.requestItem.create({
            data: {
              requestId,
              stockInId: item.stockInId,
              qtyRequested: new Decimal(item.qtyRequested),
              qtyApproved: item.qtyApproved
                ? new Decimal(item.qtyApproved)
                : new Decimal(item.qtyRequested),
              qtyRemaining: item.qtyApproved
                ? new Decimal(item.qtyApproved)
                : new Decimal(item.qtyRequested),
            },
          });
        }
      }

      // 3️⃣ Modify existing items
      if (data.itemModifications && data.itemModifications.length > 0) {
        for (const mod of data.itemModifications) {
          const updateData: any = {};
          if (mod.qtyRequested !== undefined) updateData.qtyRequested = new Decimal(mod.qtyRequested);
          if (mod.qtyApproved !== undefined) {
            updateData.qtyApproved = new Decimal(mod.qtyApproved);
            updateData.qtyRemaining = new Decimal(mod.qtyApproved);
          }
          if (mod.stockInId !== undefined) updateData.stockInId = mod.stockInId;

          if (Object.keys(updateData).length > 0) {
            await tx.requestItem.update({
              where: { id: mod.requestItemId },
              data: updateData,
            });
          }
        }
      }

      // 4️⃣ Update request approval info
      const updatedRequest = await tx.request.update({
        where: { id: requestId },
        data: {
          status: RequestStatus.APPROVED,
        //   approvedByAdminId: data.approvedByAdminId,
        //   approvedByEmployeeId: data.approvedByEmployeeId,
        },
        include: {
          requestItems: true,
        },
      });

      return updatedRequest;
    });
  }

  
  async rejectRequest(
    requestId: string,
    data: {
      rejectedByAdminId?: string;
      rejectedByEmployeeId?: string;
      notes?: string;
    },
  ) {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const updatedRequest = await this.prisma.request.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.REJECTED,
        notes: data.notes || request.notes,
      },
      include: {
        site: true,
        requestedByAdmin: true,
        requestedByEmployee: true,
        requestItems: {
          include: {
            stockIn: true,
          },
        },
      },
    });

    return updatedRequest;
  }

  async issueMaterials(data: {
    requestId: string;
    issuedByAdminId?: string;
    issuedByEmployeeId?: string;
    items: Array<{
      requestItemId: string;
      qtyIssued: number;
      notes?: string;
    }>;
  }) {
    const request = await this.prisma.request.findUnique({
      where: { id: data.requestId },
      include: { requestItems: true },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const requestStatus:any = request.status

    if (![RequestStatus.APPROVED, RequestStatus.PARTIALLY_ISSUED].includes(requestStatus)) {
      throw new BadRequestException('Request must be approved before issuing materials');
    }

    const issuedItems:any = [];
    const stockHistoryRecords:any = [];

    await this.prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        const requestItem = await tx.requestItem.findUnique({
          where: { id: item.requestItemId },
          include: { stockIn: true },
        });

        if (!requestItem) {
          throw new NotFoundException(`Request item ${item.requestItemId} not found`);
        }

        const qtyToIssue = new Decimal(item.qtyIssued);
        const currentQtyIssued = requestItem.qtyIssued;
        const newQtyIssued = currentQtyIssued.add(qtyToIssue);

        // Validate quantity
        const qtyApproved = requestItem.qtyApproved || requestItem.qtyRequested;
        if (newQtyIssued.gt(qtyApproved)) {
          throw new BadRequestException(
            `Cannot issue more than approved for ${requestItem.stockIn.productName}`,
          );
        }

        // Check stock availability
        const stockIn = await tx.stockIn.findUnique({
          where: { id: requestItem.stockInId },
        });

        if (!stockIn) {
      throw new NotFoundException('StockIn not found');
    }


        if (stockIn.quantity < item.qtyIssued) {
          throw new BadRequestException(
            `Insufficient stock for ${stockIn.productName}. Available: ${stockIn.quantity}`,
          );
        }

        // Update stock quantity
        const newStockQty = stockIn.quantity - item.qtyIssued;
        await tx.stockIn.update({
          where: { id: stockIn.id },
          data: { quantity: newStockQty },
        });

        // Update request item
        const newQtyRemaining = requestItem.qtyRemaining.sub(qtyToIssue);
        await tx.requestItem.update({
          where: { id: item.requestItemId },
          data: {
            qtyIssued: newQtyIssued,
            qtyRemaining: newQtyRemaining.lte(0) ? new Decimal(0) : newQtyRemaining,
            
          },
        });

        // Create stock history
        const stockHistory = await tx.stockHistory.create({
          data: {
            stockInId: requestItem.stockInId,
            movementType: MovementType.OUT,
            sourceType: SourceType.ISSUE,
            sourceId: data.requestId,
            qtyBefore: new Decimal(stockIn.quantity),
            qtyChange: qtyToIssue.neg(),
            qtyAfter: new Decimal(newStockQty),
            unitPrice: stockIn.unitPrice,
            notes: item.notes || `Issued for request ${request.ref_no}`,
            createdByAdminId: data.issuedByAdminId,
            createdByEmployeeId: data.issuedByEmployeeId,
          },
        });

        issuedItems.push({
          requestItemId: item.requestItemId,
          productName: requestItem.stockIn.productName,
          qtyIssued: item.qtyIssued,
        });

        stockHistoryRecords.push(stockHistory);
      }

      // Check if all items are fully issued
      const updatedRequestItems = await tx.requestItem.findMany({
        where: { requestId: data.requestId },
      });

      const allItemsIssued = updatedRequestItems.every(item =>
        item.qtyIssued.gte(item.qtyApproved || item.qtyRequested),
      );

      const someItemsIssued = updatedRequestItems.some(item => item.qtyIssued.gt(0));

      let newStatus:any = RequestStatus.APPROVED;
      if (allItemsIssued) {
        newStatus = RequestStatus.ISSUED;
      } else if (someItemsIssued) {
        newStatus = RequestStatus.PARTIALLY_ISSUED;
      }

      // Update request
      await tx.request.update({
        where: { id: data.requestId },
        data: {
          status: newStatus,
          issuedAt: new Date(),
          issuedByAdminId: data.issuedByAdminId,
          issuedByEmployeeId: data.issuedByEmployeeId,
        },
      });
    });

    return {
      requestId: data.requestId,
      issuedItems,
      stockHistoryRecords,
    };
  }

  async receiveMaterials(data: {
    requestId: string;
    receivedByAdminId?: string;
    receivedByEmployeeId?: string;
    items: Array<{
      requestItemId: string;
      qtyReceived: number;
    }>;
  }) {
    const request = await this.prisma.request.findUnique({
      where: { id: data.requestId },
      include: { requestItems: true },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (![RequestStatus.ISSUED, RequestStatus.PARTIALLY_ISSUED].includes(request.status as any)) {
      throw new BadRequestException('Request must be issued before receiving materials');
    }

    const receivedItems:any = [];

    await this.prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        const requestItem = await tx.requestItem.findUnique({
          where: { id: item.requestItemId },
          include: { stockIn: true },
        });

        if (!requestItem) {
          throw new NotFoundException(`Request item ${item.requestItemId} not found`);
        }

        const qtyToReceive = new Decimal(item.qtyReceived);
        const currentQtyReceived = requestItem.qtyReceived || new Decimal(0);
        const newQtyReceived = currentQtyReceived.add(qtyToReceive);

        // Validate quantity
        if (newQtyReceived.gt(requestItem.qtyIssued)) {
          throw new BadRequestException(
            `Cannot receive more than issued for ${requestItem.stockIn.productName}`,
          );
        }

        // Update request item
        await tx.requestItem.update({
          where: { id: item.requestItemId },
          data: {
            qtyReceived: newQtyReceived,
          },
        });

        // Create stock history for receipt
        await tx.stockHistory.create({
          data: {
            stockInId: requestItem.stockInId,
            movementType: MovementType.IN,
            sourceType: SourceType.RECEIPT,
            sourceId: data.requestId,
            qtyBefore: currentQtyReceived,
            qtyChange: qtyToReceive,
            qtyAfter: newQtyReceived,
            unitPrice: requestItem.stockIn.unitPrice,
            notes: `Received for request ${request.ref_no}`,
            createdByAdminId: data.receivedByAdminId,
            createdByEmployeeId: data.receivedByEmployeeId,
          },
        });

        receivedItems.push({
          requestItemId: item.requestItemId,
          productName: requestItem.stockIn.productName,
          qtyReceived: item.qtyReceived,
        });
      }

      // Check if all items are fully received
      const updatedRequestItems = await tx.requestItem.findMany({
        where: { requestId: data.requestId },
      });

      const allItemsReceived = updatedRequestItems.every(item =>
        (item.qtyReceived || new Decimal(0)).gte(item.qtyIssued),
      );

      // Update request status
      await tx.request.update({
        where: { id: data.requestId },
        data: {
          receivedAt: new Date(),
          status: allItemsReceived ? RequestStatus.CLOSED : request.status,
          closedAt: allItemsReceived ? new Date() : null,
          closedByAdminId: allItemsReceived ? data.receivedByAdminId : null,
          closedByEmployeeId: allItemsReceived ? data.receivedByEmployeeId : null,
        },
      });
    });

    return {
      requestId: data.requestId,
      receivedItems,
    };
  }

  /**
   * Modify and/or approve a request
   */
  async modifyAndApproveRequest(
    requestId: string,
    userId: string,
    userRole: string,
    data: {
      notes?: string;
      itemModifications?: Array<{
        requestItemId: string;
        qtyRequested?: number;
        qtyApproved?: number;
        stockInId?: string;
      }>;
      itemsToAdd?: Array<{
        stockInId: string;
        qtyRequested: number;
        qtyApproved?: number;
      }>;
      itemsToRemove?: string[];
      modificationReason?: string;
    },
  ) {
    // 1️⃣ Fetch request with items
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: { requestItems: true },
    });

    if (!request) throw new NotFoundException('Request not found');

    // 2️⃣ Permission check
    const canModify = this.checkModificationPermissions(request.status, userRole);
    if (!canModify.allowed) throw new ForbiddenException(canModify.reason);

    // 3️⃣ Transaction for atomic modifications
    return this.prisma.$transaction(async (tx) => {
      // 3a. Update notes if provided
      if (data.notes !== undefined) {
        await tx.request.update({
          where: { id: requestId },
          data: { notes: data.notes },
        });
      }

      // 3b. Modify existing items
      if (data.itemModifications?.length) {
        for (const mod of data.itemModifications) {
          const updateData: any = {};
          if (mod.qtyRequested !== undefined) updateData.qtyRequested = new Decimal(mod.qtyRequested);
          if (mod.qtyApproved !== undefined) {
            updateData.qtyApproved = new Decimal(mod.qtyApproved);
            updateData.qtyRemaining = new Decimal(mod.qtyApproved);
          }
          if (mod.stockInId !== undefined) updateData.stockInId = mod.stockInId;

          if (Object.keys(updateData).length > 0) {
            await tx.requestItem.update({
              where: { id: mod.requestItemId },
              data: updateData,
            });
          }
        }
      }

      // 3c. Add new items
      if (data.itemsToAdd?.length) {
        for (const item of data.itemsToAdd) {
          await tx.requestItem.create({
            data: {
              requestId,
              stockInId: item.stockInId,
              qtyRequested: new Decimal(item.qtyRequested),
              qtyApproved: item.qtyApproved ? new Decimal(item.qtyApproved) : new Decimal(item.qtyRequested),
              qtyRemaining: item.qtyApproved ? new Decimal(item.qtyApproved) : new Decimal(item.qtyRequested),
              qtyIssued: new Decimal(0),
              qtyReceived: new Decimal(0),
            },
          });
        }
      }

      // 3d. Remove items
      if (data.itemsToRemove?.length) {
        await tx.requestItem.deleteMany({
          where: {
            id: { in: data.itemsToRemove },
            requestId,
          },
        });
      }

      // 3e. Determine new request status based on role
      let newStatus = request.status;
      let approvalLevel = 'DSE';

      if (userRole === 'ADMIN' || userRole === 'PADIRI') {
        if ([RequestStatus.APPROVED, RequestStatus.PARTIALLY_ISSUED].includes(request.status as any)) {
          newStatus = RequestStatus.APPROVED; // reset for review
        }
        approvalLevel = userRole;
      } else if (userRole === 'DIOCESAN_SITE_ENGINEER') {
        newStatus = RequestStatus.PENDING; // mark as pending review
        approvalLevel = 'DSE';
      }

      // 3f. Update request status and approver info
      await tx.request.update({
        where: { id: requestId },
        data: {
          status: newStatus,
        //   approvedByAdminId: userRole === 'ADMIN' ? userId : undefined,
        //   approvedByEmployeeId: userRole !== 'ADMIN' ? userId : undefined,
        },
      });

    

      // 4️⃣ Return updated request with all items
      return tx.request.findUnique({
        where: { id: requestId },
        include: {
          requestItems: true,
          requestedByAdmin: true,
          requestedByEmployee: true,
        },
      });
    });
  }

  /**
   * Permission checker (adjust as needed)
   */
  private checkModificationPermissions(status: RequestStatus, role: string) {
    const allowedRoles = ['ADMIN', 'PADIRI', 'DIOCESAN_SITE_ENGINEER'];
    if (!allowedRoles.includes(role)) {
      return { allowed: false, reason: 'Role cannot modify this request' };
    }

    if ([RequestStatus.CLOSED, RequestStatus.REJECTED].includes(status as any)) {
      return { allowed: false, reason: 'Cannot modify a closed or rejected request' };
    }

    return { allowed: true };
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    siteId?: string;
    status?: RequestStatus;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.siteId) where.siteId = params.siteId;
    if (params.status) where.status = params.status;

    const [requests, total] = await Promise.all([
      this.prisma.request.findMany({
        where,
        skip,
        take: limit,
        include: {
          site: true,
          requestedByAdmin: true,
          requestedByEmployee: true,
          requestItems: {
            include: {
              stockIn: {
                include: {
                  stockcategory: true,
                  store: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.request.count({ where }),
    ]);

    return {
      requests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  async getIssuableRequests(query: {
    page?: number;
    limit?: number;
    siteId?: string;
  }) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const offset = (page - 1) * limit;

    // Build filters
    const where: Prisma.RequestWhereInput = {
      status: { in: [RequestStatus.APPROVED, RequestStatus.PARTIALLY_ISSUED] },
    };

    if (query.siteId) {
      where.siteId = query.siteId;
    }

    // Count total items for pagination
    const totalItems = await this.prisma.request.count({ where });

    // Fetch paginated requests
    const requests = await this.prisma.request.findMany({
      where,
      include: {
        requestItems: {
          where: {
            OR: [
              { qtyRemaining: { gt: new Decimal(0) } },
              { qtyIssued: { equals: new Decimal(0) } },
            ],
          },
          include: {
            stockIn: {
              include: {
                stockcategory: true,
                store: true,
              },
            },
          },
        },
        requestedByAdmin: true,
        requestedByEmployee: true,
        site: true,
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'asc' },
    });

    return {
      requests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  async findOne(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        site: true,
        requestedByAdmin: true,
        requestedByEmployee: true,
        issuedByAdmin: true,
        issuedByEmployee: true,
        closedByAdmin: true,
        closedByEmployee: true,
        requestItems: {
          include: {
            stockIn: {
              include: {
                stockcategory: true,
                store: true,
              },
            },
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  private async generateRefNo(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const count = await this.prisma.request.count({
      where: {
        createdAt: {
          gte: new Date(year, date.getMonth(), 1),
          lt: new Date(year, date.getMonth() + 1, 1),
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `REQ-${year}${month}-${sequence}`;
  }
}