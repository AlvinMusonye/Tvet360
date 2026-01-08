// src/components/Layout/navigation.js
import {
  Home,
  Users,
  BookOpen,
  BarChart2,
  Settings,
  Building2,
  UserCog,
  FileText,
  LogOut,
  Layout,
  DollarSign,
  Users2,
  Briefcase,
  Gavel, ClipboardCheck
} from 'lucide-react';

export const navigationItems = {
  moe: [
    { title: 'Dashboard', path: '/moe', icon: <Home size={18} /> },
    { title: 'Institutions', path: '/moe/institutions', icon: <Building2 size={18} /> },
    // { title: 'Programs', path: '/moe/programs', icon: <BookOpen size={18} /> },
    {
  title: 'Employment',
  path: '/moe/employment',
  icon: <Briefcase size={18} />
},
    { title: 'Reports', path: '/moe/reports', icon: <BarChart2 size={18} /> },
        {
  title: 'Equity & Compliance',
  path: '/moe/equity',
  icon: <Users2 size={18} />
},
{
  title: 'User Management',
  path: '/moe/users',
  icon: <Users size={18} />
},
{
  title: 'Audit',
  path: '/moe/audit',
  icon: <Gavel size={18} />
},
{ title: 'Settings', path: '/moe/settings', icon: <Settings size={18} /> },

  ],
  sp: [
    { title: 'Dashboard', path: '/sp', icon: <Home size={18} /> },
    { title: 'My Programs', path: '/sp/programs', icon: <BookOpen size={18} /> },
    { title: 'Students', path: '/sp/students', icon: <Users size={18} /> },
    { title: 'Assessments', path: '/sp/assessments', icon: <FileText size={18} /> },
    { title: 'Settings', path: '/sp/settings', icon: <Settings size={18} /> },
  ],
  institution: [
    { title: 'Dashboard', path: '/institution', icon: <Home size={18} /> },
    { title: 'Students', path: '/institution/students', icon: <Users size={18} /> },
    { title: 'Staff', path: '/institution/staff', icon: <UserCog size={18} /> },
    { title: 'Programs', path: '/institution/programs', icon: <BookOpen size={18} /> },
      { 
    title: 'Infrastructure', 
    path: '/institution/infrastructure', 
    icon: <Layout size={18} />  
  },
  {
  title: 'Audit',
  path: '/institution/audit',
  icon: <ClipboardCheck size={18} />
},
  { 
    title: 'Financial Management', 
    path: '/institution/financial', 
    icon: <DollarSign size={18} /> 
  },

    { title: 'Reports', path: '/institution/reports', icon: <BarChart2 size={18} /> },
  ],
};