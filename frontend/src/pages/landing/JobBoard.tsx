import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Briefcase, Calendar, ChevronRight } from 'lucide-react';
import company_logo from '../../../src/assets/images/aby_hr.png'
import jobService from '../../services/jobService';

import type { Job } from '../../types/model';

interface Company {
  name: string;
  logo: string;
}

// Mock data with explicit types
const mockJobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    description: "We are looking for an experienced Frontend Developer to join our dynamic team. You'll be working on cutting-edge web applications using React, TypeScript, and modern development tools.",
    location: "San Francisco, CA",
    employment_type: "Full-time",
    experience_level: "Senior",
    industry: "Technology",
    companyId: 1,
    skills_required: ["React", "TypeScript", "JavaScript", "CSS", "Git"],
    status: "active",
    posted_at: "2024-09-01T10:00:00Z",
    expiry_date: "2024-10-01T23:59:59Z",
  },
  {
    id: 2,
    title: "Product Manager",
    description: "Join our product team to drive innovation and strategy. You'll work closely with engineering, design, and business teams to deliver exceptional user experiences.",
    location: "New York, NY",
    employment_type: "Full-time",
    experience_level: "Mid-level",
    industry: "Technology",
    companyId: 2,
    skills_required: ["Product Management", "Analytics", "Agile", "Strategy"],
    status: "active",
    posted_at: "2024-08-28T09:30:00Z",
    expiry_date: "2024-09-28T23:59:59Z",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    description: "We're seeking a creative UX/UI Designer to help shape the future of our digital products. You'll be responsible for user research, wireframing, and creating beautiful interfaces.",
    location: "Remote",
    employment_type: "Contract",
    experience_level: "Mid-level",
    industry: "Design",
    companyId: 3,
    skills_required: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    status: "active",
    posted_at: "2024-09-05T14:15:00Z",
    expiry_date: "2024-10-05T23:59:59Z",
  },
  {
    id: 4,
    title: "Data Scientist",
    description: "Looking for a Data Scientist to analyze complex datasets and build machine learning models. You'll work with large-scale data to drive business insights.",
    location: "Austin, TX",
    employment_type: "Full-time",
    experience_level: "Senior",
    industry: "Technology",
    companyId: 4,
    skills_required: ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow"],
    status: "active",
    posted_at: "2024-09-03T11:45:00Z",
    expiry_date: "2024-10-03T23:59:59Z",
  },
  {
    id: 5,
    title: "Marketing Specialist",
    description: "We need a creative Marketing Specialist to develop and execute marketing campaigns. You'll work across digital channels to increase brand awareness and drive growth.",
    location: "Chicago, IL",
    employment_type: "Part-time",
    experience_level: "Entry-level",
    industry: "Marketing",
    companyId: 5,
    skills_required: ["Digital Marketing", "Content Creation", "SEO", "Analytics"],
    status: "active",
    posted_at: "2024-09-07T16:20:00Z",
    expiry_date: "2024-10-07T23:59:59Z",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    description: "Join our infrastructure team as a DevOps Engineer. You'll be responsible for CI/CD pipelines, cloud infrastructure, and ensuring system reliability.",
    location: "Seattle, WA",
    employment_type: "Full-time",
    experience_level: "Senior",
    industry: "Technology",
    companyId: 6,
    skills_required: ["AWS", "Docker", "Kubernetes", "Terraform", "Python"],
    status: "active",
    posted_at: "2024-09-02T08:30:00Z",
    expiry_date: "2024-10-02T23:59:59Z",
  },
];


const JobBoard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // In real app: const jobs = await jobService.getAllJobs();
       const Jobs = await jobService.getAllJobs();
        setJobs(Jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getEmploymentTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return 'bg-green-100 text-green-800';
      case 'part-time':
        return 'bg-primary-100 text-primary-800';
      case 'contract':
        return 'bg-red-100 text-red-800';
      case 'freelance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceLevelColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'entry-level':
        return 'bg-emerald-100 text-emerald-800';
      case 'mid-level':
        return 'bg-amber-100 text-amber-800';
      case 'senior':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJobs: Job[] = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.employment_type.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="w-11/12 mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-4 bg--200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 p-6">
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing opportunities with top companies. Your next career move starts here.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {(['all', 'FULL_TIME', 'PART_TIME', 'CONTRACT','INTERNSHIP'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                filter === filterType
                  ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {filterType === 'all' ? 'All Jobs' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-primary-600">{filteredJobs.length}</span> job opportunities
          </p>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((job) => {
            

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group cursor-pointer"
              >
                <div className="p-6">
                  {/* Company Info Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <img
                        src={company_logo}
                        alt={`logo`}
                        className="w-14 h-14 rounded-xl object-cover shadow-sm border border-gray-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 font-medium">Aby Hr management</p>
                    </div>
                  </div>

                  {/* Job Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {job.description}
                  </p>

                  {/* Job Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span>Posted {formatDate(job.posted_at!)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEmploymentTypeColor(job.employment_type)}`}>
                      {job.employment_type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExperienceLevelColor(job.experience_level)}`}>
                      {job.experience_level}
                    </span>
                    {job.industry && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {job.industry}
                      </span>
                    )}
                  </div>

                  {/* Skills */}
                  {job.skills_required && job.skills_required.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-medium text-gray-500 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {job.skills_required.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills_required.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            +{job.skills_required.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Apply Button */}
                  <button className="w-full bg-gradient-to-r from-primary-600 to-red-600 text-white font-medium py-3 px-4 rounded-xl hover:from-primary-700 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 group-hover:shadow-lg">
                    <span>Apply Now</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && !loading && (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more opportunities.</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white text-gray-700 font-medium py-3 px-8 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm">
              Load More Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;