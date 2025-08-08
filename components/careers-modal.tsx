"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users } from 'lucide-react'

interface CareersModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CareersModal({ isOpen, onClose }: CareersModalProps) {
  const jobOpenings = [
    {
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Sydney, Australia",
      type: "Full-time",
      description: "Join our engineering team to build the next generation of AR automation tools.",
      requirements: ["5+ years React/Node.js experience", "Experience with financial software", "Strong problem-solving skills"]
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Melbourne, Australia",
      type: "Full-time",
      description: "Lead product strategy for our digital collections platform.",
      requirements: ["3+ years product management", "B2B SaaS experience", "Strong analytical skills"]
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Brisbane, Australia",
      type: "Full-time",
      description: "Help our customers maximize value from Kuhlekt's AR automation platform.",
      requirements: ["2+ years customer success", "Finance industry knowledge", "Excellent communication skills"]
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Join Our Team</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-gray-600">
            <p className="mb-4">
              At Kuhlekt, we're revolutionizing how businesses manage their accounts receivable. Join our growing team 
              and help finance teams around the world get paid faster with less stress.
            </p>
            <p>
              We offer competitive salaries, comprehensive benefits, flexible work arrangements, and the opportunity 
              to make a real impact in the fintech space.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Current Openings</h3>
            
            {jobOpenings.map((job, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {job.department}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    Apply Now
                  </Button>
                </div>
                
                <p className="text-gray-600 mb-4">{job.description}</p>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Key Requirements:</h5>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {job.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-cyan-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Work at Kuhlekt?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Benefits & Perks</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Competitive salary and equity</li>
                  <li>• Comprehensive health insurance</li>
                  <li>• Flexible work arrangements</li>
                  <li>• Professional development budget</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Culture & Growth</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Collaborative team environment</li>
                  <li>• Opportunity to shape product direction</li>
                  <li>• Work with cutting-edge technology</li>
                  <li>• Make a real impact in fintech</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Don't see a role that fits? We're always looking for talented individuals.
            </p>
            <Button variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">
              Send Us Your Resume
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
