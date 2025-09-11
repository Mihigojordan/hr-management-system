import { useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import { 
  Phone, Mail, MapPin, Clock, Send, MessageCircle, Building, HelpCircle, User, ArrowRight, Users
} from "lucide-react";
import HeaderBanner from "../../components/landing/HeaderBanner";

// --- Types ---
interface FormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  inquiryType: string;
  employeeId: string;
  message: string;
}

interface ContactMethod {
  icon: JSX.Element;
  title: string;
  description: string;
  info: string[];
  action: string;
  availability: string;
}

interface OfficeLocation {
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  services: string[];
}

export default function HRContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    department: '',
    inquiryType: '',
    employeeId: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    setFormSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        inquiryType: '',
        employeeId: '',
        message: ''
      });
    }, 3000);
  };

  const contactMethods: ContactMethod[] = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: "HR Helpline",
      description: "Speak directly with our HR specialists",
      info: ["+250 788 123 456", "+250 788 654 321"],
      action: "Call HR",
      availability: "24/7 Emergency Support"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Support",
      description: "Send us your HR queries anytime",
      info: ["hr@company.rw", "support@hrms.rw"],
      action: "Send Email",
      availability: "Response within 4 hours"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Live Chat",
      description: "Get instant help from HR team",
      info: ["Available on portal", "WhatsApp: +250 788 123 456"],
      action: "Start Chat",
      availability: "8 AM - 6 PM"
    }
  ];

  const officeLocations: OfficeLocation[] = [
    {
      name: "Main HR Office",
      address: "KG 15 Ave, Kimihurura",
      city: "Kigali, Rwanda",
      phone: "+250 788 123 456",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM",
      services: ["Employee Relations", "Recruitment", "Payroll Support"]
    },
    {
      name: "Training Center",
      address: "KN 3 Rd, Nyarutarama",
      city: "Kigali, Rwanda",
      phone: "+250 788 654 321",
      hours: "Mon - Fri: 9:00 AM - 5:00 PM",
      services: ["Training Programs", "Career Development", "Skills Assessment"]
    }
  ];

  const inquiryTypes = [
    "Payroll Inquiry",
    "Benefits Question",
    "Leave Request",
    "Performance Review",
    "Training Request",
    "Policy Clarification",
    "Grievance Report",
    "System Access Issue",
    "Document Request",
    "General HR Support",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-100">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-primary-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary-300 rounded-full opacity-15"></div>
      </div>
      
      <HeaderBanner
        title="Contact HR"
        subtitle="Home / Contact Us"
        backgroundStyle="image"
        icon={<Users className="w-10 h-10" />}
      />

      {/* Quick Contact & Form Sections */}
      {/* ...keep the JSX mostly unchanged, using typed formData and contactMethods/officeLocations */}
    </div>
  );
}
