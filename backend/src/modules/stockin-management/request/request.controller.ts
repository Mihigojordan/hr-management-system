// src/request/request.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestStatus } from 'generated/prisma';
import { RequestGateway } from './request.gateway';

// DTOs
export class CreateRequestDto {
  siteId: string;
  requestedByAdminId?: string;
  requestedByEmployeeId?: string;
  notes?: string;
  items: Array<{
    stockInId: string;
    qtyRequested: number;
  }>;
}

export class FindAllRequestsDto {
  page?: string;
  limit?: string;
  siteId?: string;
  status?: RequestStatus;
}

export class ApproveRequestDto {
  approvedByAdminId?: string;
  approvedByEmployeeId?: string;
  itemApprovals?: Array<{
    requestItemId: string;
    qtyApproved: number;
  }>;
}

export class RejectRequestDto {
  rejectedByAdminId?: string;
  rejectedByEmployeeId?: string;
  notes?: string;
}

export class IssueMaterialsDto {
  requestId: string;
  issuedByAdminId?: string;
  issuedByEmployeeId?: string;
  items: Array<{
    requestItemId: string;
    qtyIssued: number;
    notes?: string;
  }>;
}

export class ReceiveMaterialsDto {
  requestId: string;
  receivedByAdminId?: string;
  receivedByEmployeeId?: string;
  items: Array<{
    requestItemId: string;
    qtyReceived: number;
  }>;
}

export class ModifyAndApproveRequestDto {
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
}


@Controller('stock-requests')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
     private readonly requestGateway: RequestGateway, // Inject the gateway
) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRequestDto: CreateRequestDto) {
    const request = await this.requestService.createRequest(createRequestDto);
    this.requestGateway.emitRequestCreated(request)
    return {
      success: true,
      data: { request },
      message: 'Request created successfully',
    };
  }

  @Get()
  async findAll(@Query() query: FindAllRequestsDto) {
    const result = await this.requestService.findAll({
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
      siteId: query.siteId,
      status: query.status,
    });



    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const request = await this.requestService.findOne(id);
    return {
      success: true,
      data: { request },
    };
  }

  @Get('issuable')
  async getIssuableRequests(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('siteId') siteId?: string,
  ) {
    const result = await this.requestService.getIssuableRequests({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      siteId,
    });

    return {
      success: true,
      data: result.requests,
      pagination: result.pagination,
    };
  }

  @Patch(':id/approve')
  async approve(
    @Param('id') id: string,
    @Body() approveRequestDto: ApproveRequestDto,
  ) {
    const request = await this.requestService.approveRequest(id, approveRequestDto);
     this.requestGateway.emitRequestApproved(request)
    return {
      success: true,
      data: { request },
      message: 'Request approved successfully',
    };
  }
  @Patch(':id/modify-approve')
  async modifyAndApprove(
    @Param('id') id: string,
    @Body() data: ModifyAndApproveRequestDto,
    @Req() req: any, // contains logged-in user info (id & role)
  ) {
    const userId = req.user.id;
    const userRole = req.user.role.name;

    // Call the service function
    const updatedRequest: any = await this.requestService.modifyAndApproveRequest(
      id,
      userId,
      userRole,
      data,
    );

    // Emit WebSocket event to notify clients
    this.requestGateway.emitRequestUpdated(updatedRequest);

    return {
      success: true,
      message: 'Request modified and approved successfully',
      data: { request: updatedRequest },
    };
  }

  @Patch(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body() rejectRequestDto: RejectRequestDto,
  ) {
    const request = await this.requestService.rejectRequest(id, rejectRequestDto);
     this.requestGateway.emitRequestRejected(request)
    return {
      success: true,
      data: { request },
      message: 'Request rejected',
    };
  }

  @Post('issue-materials')
  async issueMaterials(@Body() issueMaterialsDto: IssueMaterialsDto) {
    const result = await this.requestService.issueMaterials(issueMaterialsDto);
     this.requestGateway.emitMaterialsIssued(result)
    return {
      success: true,
      data: result,
      message: 'Materials issued successfully',
    };
  }

  @Post('receive-materials')
  async receiveMaterials(@Body() receiveMaterialsDto: ReceiveMaterialsDto) {
    const result = await this.requestService.receiveMaterials(receiveMaterialsDto);
     this.requestGateway.emitMaterialsReceived(result)
    return {
      success: true,
      data: result,
      message: 'Materials received successfully',
    };
  }
}

