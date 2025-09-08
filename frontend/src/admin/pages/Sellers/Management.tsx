import React, { useState } from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Users, Plus, Settings, Shield, UserCheck, BarChart3 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Badge } from '@/shared/components/ui/badge'
import UsersList from './List'
import UsersCreateEdit from './CreateEdit'
import UsersDetails from './Details'

// Quick stats component
const QuickStats = () => {
  const stats = [
    { title: 'Total Users', value: '12,489', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Active Users', value: '9,234', change: '+8%', icon: UserCheck, color: 'green' },
    { title: 'Verified Users', value: '7,891', change: '+15%', icon: Shield, color: 'purple' },
    { title: 'New Registrations', value: '234', change: '+23%', icon: Plus, color: 'orange' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
                  </div>
                </div>
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-4 h-4 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function UsersPage() {
  const location = useLocation()
  const isDetailView = location.pathname.includes('/users/')
  
  if (isDetailView) {
    return (
      <Routes>
        <Route path="/create" element={<UsersCreateEdit />} />
        <Route path="/edit/:id" element={<UsersCreateEdit />} />
        <Route path="/:id" element={<UsersDetails />} />
      </Routes>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Comprehensive management of user accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/admin/users/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Content */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="list">Users List</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          <UsersList />
        </TabsContent>
        
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Permissions & Roles Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Permissions Management</h3>
                <p className="text-muted-foreground mb-4">Define user permissions and manage roles</p>
                <Button variant="outline">
                  Setup Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Activity Log</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Activity Log</h3>
                <p className="text-muted-foreground mb-4">Track user activities and operation logs</p>
                <Button variant="outline">
                  View Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>User Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Reports & Statistics</h3>
                <p className="text-muted-foreground mb-4">Generate detailed reports about user activity</p>
                <Button variant="outline">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}