import React from 'react'
import jobService from '../../services/jobService'
jobService.getAllJobs()
import type { Job } from '../../types/model'
import company_logo from'../../assets/aby_hr.png'

const JobBoard = () => {
  return (
    <div>JobBoard</div>
  )
}

export default JobBoard