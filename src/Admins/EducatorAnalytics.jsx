import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TabButton = ({ value, activeTab, children, onClick }) => (
  <Button
    variant={activeTab === value ? 'default' : 'outline'}
    onClick={onClick}
    className="transition-colors"
  >
    {children}
  </Button>
);

const MetricCard = ({ title, value, description }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-4xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const StudentPerformanceItem = ({ student, progress, lastActive }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-sm font-medium">
          {student.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      <div>
        <p className="font-medium">{student}</p>
        <p className="text-sm text-muted-foreground">Last active: {lastActive}</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <div className="w-32 h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full rounded-full bg-green-500" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm font-medium">{progress}%</span>
    </div>
  </div>
);

export default function EducatorAnalytics() {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [timeRange, setTimeRange] = useState('30days');
  const [activeTab, setActiveTab] = useState('overview');

  // In a real app, you would fetch this data from an API
  const [courses] = useState([
    { id: '1', title: 'Introduction to React' },
    { id: '2', title: 'Advanced JavaScript' },
    { id: '3', title: 'UI/UX Design Fundamentals' },
  ]);

  const [enrollmentData] = useState([
    { name: 'Jan', students: 12 },
    { name: 'Feb', students: 19 },
    { name: 'Mar', students: 15 },
    { name: 'Apr', students: 28 },
    { name: 'May', students: 32 },
    { name: 'Jun', students: 24 },
  ]);

  const [completionData] = useState([
    { name: 'Completed', value: 75 },
    { name: 'In Progress', value: 15 },
    { name: 'Not Started', value: 10 },
  ]);

  const [studentPerformance] = useState([
    { student: 'Student_name One', progress: 92, lastActive: '2 days ago' },
    { student: 'Student_name Two', progress: 85, lastActive: '1 day ago' },
    { student: 'Student_name Three', progress: 78, lastActive: '5 days ago' },
    { student: 'Student_name Four', progress: 65, lastActive: '1 week ago' },
    { student: 'Student_name Five', progress: 58, lastActive: '2 weeks ago' },
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">Course Analytics</h1>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="space-y-1">
            <label htmlFor="course-select" className="text-sm block">Select Course</label>
            <select
              id="course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="time-range" className="text-sm block">Time Range</label>
            <select
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <TabButton 
          value="overview" 
          activeTab={activeTab}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </TabButton>
        <TabButton 
          value="students" 
          activeTab={activeTab}
          onClick={() => setActiveTab('students')}
        >
          Student Insights
        </TabButton>
        <TabButton 
          value="engagement" 
          activeTab={activeTab}
          onClick={() => setActiveTab('engagement')}
        >
          Engagement
        </TabButton>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard 
                title="Total Students" 
                value="124" 
                description="+12% from last month" 
              />
              <MetricCard 
                title="Completion Rate" 
                value="75%" 
                description="+8% from last month" 
              />
              <MetricCard 
                title="Avg. Time Spent" 
                value="3.2h" 
                description="per student per week" 
              />
            </div>

            {/* Enrollment Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Completion Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Course Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={completionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {completionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'students' && (
          <Card>
            <CardHeader>
              <CardTitle>Student Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentPerformance.map((student, index) => (
                  <StudentPerformanceItem
                    key={index}
                    student={student.student}
                    progress={student.progress}
                    lastActive={student.lastActive}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'engagement' && (
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Coming soon - Detailed engagement analytics</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}