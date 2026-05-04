// Mock data for demo - in production this comes from Supabase
export function useMockData(companyId?: string) {
  const calls = [
    { id: '1', type: 'inbound', duration: 240, status: 'completed', created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), caller_name: 'Alice Johnson', caller_phone: '+1-555-0101' },
    { id: '2', type: 'outbound', duration: 180, status: 'completed', created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), caller_name: 'Bob Smith', caller_phone: '+1-555-0102' },
    { id: '3', type: 'inbound', duration: 320, status: 'completed', created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), caller_name: 'Carol White', caller_phone: '+1-555-0103' },
    { id: '4', type: 'outbound', duration: 95, status: 'missed', created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), caller_name: 'David Brown', caller_phone: '+1-555-0104' },
    { id: '5', type: 'inbound', duration: 410, status: 'completed', created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(), caller_name: 'Emma Davis', caller_phone: '+1-555-0105' },
    { id: '6', type: 'outbound', duration: 275, status: 'completed', created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(), caller_name: 'Frank Miller', caller_phone: '+1-555-0106' },
  ]

  const appointments = [
    { id: '1', client_name: 'Alice Johnson', scheduled_at: new Date(Date.now() + 1000 * 60 * 60).toISOString(), status: 'confirmed', created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: '2', client_name: 'Bob Smith', scheduled_at: new Date(Date.now() + 1000 * 60 * 180).toISOString(), status: 'pending', created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { id: '3', client_name: 'Carol White', scheduled_at: new Date(Date.now() + 1000 * 60 * 360).toISOString(), status: 'confirmed', created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
    { id: '4', client_name: 'David Brown', scheduled_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), status: 'completed', created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
    { id: '5', client_name: 'Emma Davis', scheduled_at: new Date(Date.now() + 1000 * 60 * 480).toISOString(), status: 'confirmed', created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
  ]

  const leads = [
    { id: '1', name: 'Michael Scott', email: 'michael@dundermifflin.com', phone: '+1-555-0201', source: 'Inbound Call', status: 'qualified', created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: '2', name: 'Pam Beesly', email: 'pam@dundermifflin.com', phone: '+1-555-0202', source: 'Web Form', status: 'new', created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    { id: '3', name: 'Jim Halpert', email: 'jim@dundermifflin.com', phone: '+1-555-0203', source: 'Outbound Call', status: 'converted', created_at: new Date(Date.now() - 1000 * 60 * 150).toISOString() },
    { id: '4', name: 'Dwight Schrute', email: 'dwight@beet.farm', phone: '+1-555-0204', source: 'Referral', status: 'new', created_at: new Date(Date.now() - 1000 * 60 * 200).toISOString() },
    { id: '5', name: 'Angela Martin', email: 'angela@dundermifflin.com', phone: '+1-555-0205', source: 'Inbound Call', status: 'qualified', created_at: new Date(Date.now() - 1000 * 60 * 280).toISOString() },
  ]

  // Chart data - last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    return {
      day: dayName,
      inbound: Math.floor(Math.random() * 30) + 10,
      outbound: Math.floor(Math.random() * 25) + 8,
      appointments: Math.floor(Math.random() * 15) + 3,
      leads: Math.floor(Math.random() * 12) + 2,
    }
  })

  const stats = {
    totalCalls: calls.length,
    inboundCalls: calls.filter(c => c.type === 'inbound').length,
    outboundCalls: calls.filter(c => c.type === 'outbound').length,
    totalAppointments: appointments.length,
    totalLeads: leads.length,
  }

  return { calls, appointments, leads, chartData, stats }
}

export function useMockCompanies() {
  return [
    { id: '1', name: 'Dunder Mifflin Paper', owner_name: 'Michael Scott', company_type: 'Sales', is_active: true, created_at: '2024-01-15', email: 'michael@dundermifflin.com', totalCalls: 128, totalAppointments: 42, totalLeads: 67 },
    { id: '2', name: 'Initech Software', owner_name: 'Bill Lumbergh', company_type: 'Technology', is_active: true, created_at: '2024-02-01', email: 'bill@initech.com', totalCalls: 89, totalAppointments: 31, totalLeads: 45 },
    { id: '3', name: 'Vandalay Industries', owner_name: 'George Costanza', company_type: 'Import/Export', is_active: false, created_at: '2024-02-20', email: 'george@vandalay.com', totalCalls: 34, totalAppointments: 12, totalLeads: 19 },
    { id: '4', name: 'Pied Piper', owner_name: 'Richard Hendricks', company_type: 'Technology', is_active: true, created_at: '2024-03-05', email: 'richard@piedpiper.com', totalCalls: 210, totalAppointments: 78, totalLeads: 134 },
  ]
}
