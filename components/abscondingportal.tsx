import React, { useState } from 'react';
import { Search, Upload, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const AbscondingPortal = () => {
  const initialRecords = [
    {
      id: 1,
      name: "Rajesh Sharma",
      email: "rajesh.sharma@email.com",
      company: "Infosys Technologies",
      designation: "Technical Lead",
      reportedDate: "2025-01-10",
      status: "Published", // Published, Pending, Resolved
      employerRemarks: "Employee stopped reporting to work from Jan 1, 2025. No communication received after multiple attempts.",
      employeeResponse: "Family medical emergency in hometown. Medical documents submitted.",
      documents: ["warning_letter.pdf", "final_notice.pdf"],
      responseDeadline: "2025-02-10",
      resolved: false
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.patel@email.com",
      company: "TCS Digital",
      designation: "Senior Business Analyst",
      reportedDate: "2025-01-05",
      status: "Pending",
      employerRemarks: "No show at work since Dec 25, 2024. Not responding to calls or emails.",
      employeeResponse: null,
      documents: ["notice1.pdf", "email_thread.pdf"],
      responseDeadline: "2025-02-05",
      resolved: false
    },
    {
      id: 3,
      name: "Amit Kumar Verma",
      email: "amit.verma@email.com",
      company: "Wipro Limited",
      designation: "Project Manager",
      reportedDate: "2025-01-15",
      status: "Under Review",
      employerRemarks: "Unauthorized absence since Jan 1, 2025. No proper handover of project responsibilities.",
      employeeResponse: "Joined competitor without notice. Willing to serve notice period.",
      documents: ["absence_report.pdf", "manager_statement.pdf"],
      responseDeadline: "2025-02-15",
      resolved: false
    },
    {
      id: 4,
      name: "Sneha Reddy",
      email: "sneha.reddy@email.com",
      company: "HCL Technologies",
      designation: "Software Engineer",
      reportedDate: "2025-01-08",
      status: "Published",
      employerRemarks: "Absconding after training completion. Company investment in training to be recovered.",
      employeeResponse: null,
      documents: ["training_agreement.pdf", "legal_notice.pdf"],
      responseDeadline: "2025-02-08",
      resolved: false
    }
  ];

  const [records, setRecords] = useState(initialRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEmployer, setIsEmployer] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredRecords = records.filter(record => {
    const searchStr = searchTerm.toLowerCase();
    return (
      record.name.toLowerCase().includes(searchStr) ||
      record.email.toLowerCase().includes(searchStr) ||
      record.company.toLowerCase().includes(searchStr)
    );
  });

  const handleLogin = async (username, password) => {
    // In real implementation, this would be an API call
    if (username === "admin" && password === "admin") {
      setIsEmployer(true);
      setShowLoginDialog(false);
      // Add a success message
      alert("Successfully logged in as admin");
    } else {
      alert("Invalid credentials. Please use admin/admin");
    }
  };

  const handleAddRecord = (recordData) => {
    const newRecord = {
      id: records.length + 1,
      ...recordData,
      status: "Pending",
      responseDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      resolved: false
    };
    setRecords([...records, newRecord]);
  };

  const handleEmployeeResponse = (id, response) => {
    setRecords(records.map(record => 
      record.id === id 
        ? { ...record, employeeResponse: response, status: "Under Review" }
        : record
    ));
    setShowResponseDialog(false);
  };

  return (
    <div className="min-h-screen bg-black-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-black-900">Employee Verification Portal</h1>
          <p className="text-black-600">Search and verify employee records</p>
        </header>

        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-xl">
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10"
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-black-400" />
          </div>
          {!isEmployer && (
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(true)}
            >
              Employer Login
            </Button>
          )}
          {isEmployer && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add New Record</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Record</DialogTitle>
                </DialogHeader>
                <AddRecordForm onSubmit={handleAddRecord} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Employer Login</DialogTitle>
            </DialogHeader>
            <LoginForm onLogin={handleLogin} />
          </DialogContent>
        </Dialog>

        {isEmployer && (
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Cases</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>
    )}

    <div className="space-y-6">
          {filteredRecords.map(record => (
            <Card key={record.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center justify-between">
                      <span>{record.name}</span>
                      <Badge 
                        variant={
                          record.status === "Published" ? "destructive" :
                          record.status === "Resolved" ? "secondary" :
                          "default"
                        }
                      >
                        {record.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{record.email}</CardDescription>
                  </div>
                  {isEmployer && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-4">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Case Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="text-base">Case ID: {record.id}</Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const caseUrl = `${window.location.origin}/case/${record.id}`;
                                navigator.clipboard.writeText(caseUrl);
                                alert('Case URL copied to clipboard!');
                              }}
                            >
                              Share Case URL
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold mb-2">Employee Information</h3>
                              <div className="space-y-2">
                                <p><span className="font-medium">Name:</span> {record.name}</p>
                                <p><span className="font-medium">Email:</span> {record.email}</p>
                                <p><span className="font-medium">Designation:</span> {record.designation}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold mb-2">Case Status</h3>
                              <div className="space-y-2">
                                <p><span className="font-medium">Status:</span> {record.status}</p>
                                <p><span className="font-medium">Reported Date:</span> {record.reportedDate}</p>
                                <p><span className="font-medium">Response Deadline:</span> {record.responseDeadline}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Company Details</h3>
                            <div className="space-y-2">
                              <p><span className="font-medium">Company:</span> {record.company}</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Case Details</h3>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium">Employer Remarks:</h4>
                                <p className="mt-1 text-black-600">{record.employerRemarks}</p>
                              </div>
                              {record.employeeResponse && (
                                <div>
                                  <h4 className="font-medium">Employee Response:</h4>
                                  <p className="mt-1 text-black-600">{record.employeeResponse}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Documents</h3>
                            <div className="flex flex-wrap gap-2">
                              {record.documents.map((doc, index) => (
                                <Badge key={index} variant="secondary">
                                  <Upload className="w-4 h-4 mr-2" />
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {record.status === "Pending" && (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  const emailSubject = `Absconding Case Reference: ${record.id}`;
                                  const emailBody = `Dear ${record.name},\n\nThis is regarding your absconding case (ID: ${record.id}) with ${record.company}.\n\nPlease review and respond to the case at: ${window.location.origin}/case/${record.id}\n\nResponse deadline: ${record.responseDeadline}`;
                                  window.location.href = `mailto:${record.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                                }}
                              >
                                Email Employee
                              </Button>
                              <Button>Publish Case</Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Company Details:</h3>
                    <p className="text-black-600">{record.company} - {record.designation}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Employer Remarks:</h3>
                    <p className="text-black-600">{record.employerRemarks}</p>
                  </div>
                  {record.employeeResponse && (
                    <div>
                      <h3 className="font-semibold">Employee Response:</h3>
                      <p className="text-black-600">{record.employeeResponse}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {record.documents.map((doc, index) => (
                      <Badge key={index} variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div className="flex items-center text-sm text-black-500">
                  <Clock className="w-4 h-4 mr-2" />
                  Response deadline: {record.responseDeadline}
                </div>
                {!record.employeeResponse && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRecord(record);
                      setShowResponseDialog(true);
                    }}
                  >
                    Submit Response
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Your Response</DialogTitle>
          </DialogHeader>
          <ResponseForm 
            onSubmit={(response) => handleEmployeeResponse(selectedRecord?.id, response)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

  const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    console.log('Login attempted with:', { username, password });
    setError('');
    
    // Handle login through state management
    if (username === 'admin' && password === 'admin') {
      console.log('Login successful');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onLogin && onLogin(username, password);
    } else {
      console.log('Login failed');
      setError('Invalid credentials. Use admin/admin');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-black-700 mb-1">Username</label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter admin"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-black-700 mb-1">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin"
          className="w-full"
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <Button 
        type="button"
        className="w-full"
        onClick={handleSubmit}
      >
        Login
      </Button>
      <div className="text-sm text-black-500 text-center">
        Use admin/admin to login
      </div>
    </div>
  );
};

const AddRecordForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    designation: '',
    department: '',
    joiningDate: '',
    lastWorkingDate: '',
    employerRemarks: '',
    documents: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      reportedDate: new Date().toISOString().split('T')[0],
      documents: ['notice.pdf'] // In real implementation, this would handle file uploads
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <h3 className="font-semibold">Employee Details</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Employee Name*</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email*</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Company Details</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Company Name*</label>
          <Input
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company Address*</label>
          <Textarea
            value={formData.companyAddress}
            onChange={(e) => setFormData({...formData, companyAddress: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company Email*</label>
          <Input
            type="email"
            value={formData.companyEmail}
            onChange={(e) => setFormData({...formData, companyEmail: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company Phone*</label>
          <Input
            type="tel"
            value={formData.companyPhone}
            onChange={(e) => setFormData({...formData, companyPhone: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Employment Details</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Designation*</label>
          <Input
            value={formData.designation}
            onChange={(e) => setFormData({...formData, designation: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department*</label>
          <Input
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Joining Date*</label>
          <Input
            type="date"
            value={formData.joiningDate}
            onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Working Date*</label>
          <Input
            type="date"
            value={formData.lastWorkingDate}
            onChange={(e) => setFormData({...formData, lastWorkingDate: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Case Details</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Detailed Remarks*</label>
          <Textarea
            value={formData.employerRemarks}
            onChange={(e) => setFormData({...formData, employerRemarks: e.target.value})}
            required
            placeholder="Please provide detailed information about the case including any prior warnings, communication attempts, etc."
            className="h-32"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Supporting Documents*</label>
          <p className="text-sm text-black-500 mb-2">Please upload relevant documents (warning letters, emails, notices, etc.)</p>
          <Input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFormData({...formData, documents: Array.from(e.target.files)})}
            className="cursor-pointer"
            required
          />
        </div>
      </div>
      
      <div className="pt-4">
        <Button type="submit" className="w-full">Submit Record</Button>
      </div>
    </form>
  );
};

const ResponseForm = ({ onSubmit }) => {
  const [response, setResponse] = useState('');
  const [, setDocuments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(response);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Your Response</label>
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          required
          placeholder="Provide your explanation..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Supporting Documents</label>
        <Input
          type="file"
          multiple
          onChange={(e) => setDocuments(Array.from(e.target.files))}
          className="cursor-pointer"
        />
      </div>
      <Button type="submit" className="w-full">Submit Response</Button>
    </form>
  );
};

export default AbscondingPortal;