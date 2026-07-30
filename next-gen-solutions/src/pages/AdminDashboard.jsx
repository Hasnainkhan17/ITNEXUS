import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LogOut, 
  FileText, 
  FolderGit2, 
  Users, 
  Building2, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Edit3, 
  Lock,
  Code,
  Palette,
  Cloud,
  Smartphone
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { resolveAssetUrl } from '../utils/assetLoader';

const iconMap = {
  Code: Code,
  Palette: Palette,
  Cloud: Cloud,
  Smartphone: Smartphone
};

const ImageInputOptions = ({ label, imageUrl, onChangeUrl, onFileSelected }) => {
  const [mode, setMode] = useState('url'); // 'url' or 'upload'

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelected(reader.result); // Base64 data URL
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy font-mono">{label}</label>
        <div className="flex gap-2 text-[10px] font-bold font-mono">
          <button 
            type="button" 
            onClick={() => setMode('url')} 
            className={`px-2 py-0.5 rounded transition-colors ${mode === 'url' ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500'}`}
          >
            URL
          </button>
          <button 
            type="button" 
            onClick={() => setMode('upload')} 
            className={`px-2 py-0.5 rounded transition-colors ${mode === 'upload' ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500'}`}
          >
            Upload
          </button>
        </div>
      </div>
      {mode === 'url' ? (
        <input 
          type="text" 
          required
          value={imageUrl}
          onChange={(e) => onChangeUrl(e.target.value)}
          placeholder="e.g. image-name.png or https://..."
          className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
        />
      ) : (
        <div className="relative">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100 border border-dashed border-slate-300 rounded-xl p-1.5"
          />
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);

  // Load datasets into state
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Custom Delete Confirmation Modal State
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Modal forms states
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    type: 'Blog',
    category: 'Engineering',
    shortDescription: '',
    content: '',
    author: 'ITNEXUS Team',
    readTime: '5 min read',
    imageUrl: 'itnexus-mark-color-512px.png',
    displayOrder: 0
  });
  const [blogError, setBlogError] = useState('');
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Custom Web App',
    shortDescription: '',
    fullDescription: '',
    isFeaturedOnHome: false,
    thumbnailUrl: 'itnexus-mark-color-512px.png',
    timeline: '',
    technologies: '',
    projectUrl: ''
  });

  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    shortBio: '',
    imageUrl: 'itnexus-mark-color-512px.png',
    linkedinUrl: ''
  });

  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    clientName: '',
    logoUrl: 'itnexus-mark-color-512px.png'
  });

  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    icon: 'Code',
    displayOrder: 0,
    technologies: '',
    deliverables: ''
  });

  const [projectError, setProjectError] = useState('');
  const [teamError, setTeamError] = useState('');
  const [serviceError, setServiceError] = useState('');

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      // Verify token
      const verifyRes = await fetch(`${API_BASE_URL}/auth/verify`, { headers });
      if (!verifyRes.ok) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }

      // Fetch projects
      const projRes = await fetch(`${API_BASE_URL}/projects`, { headers });
      const projData = await projRes.json();
      setProjects(projData);

      // Fetch team members
      const teamRes = await fetch(`${API_BASE_URL}/team`, { headers });
      const teamDataList = await teamRes.json();
      setTeam(teamDataList);

      // Fetch clients
      const clientRes = await fetch(`${API_BASE_URL}/clients`, { headers });
      const clientDataList = await clientRes.json();
      setClients(clientDataList);

      // Fetch inquiries
      const inqRes = await fetch(`${API_BASE_URL}/inquiries`, { headers });
      const inqData = await inqRes.json();
      setInquiries(inqData);

      // Fetch services
      const servicesRes = await fetch(`${API_BASE_URL}/services`, { headers });
      const servicesData = await servicesRes.json();
      setServices(servicesData);

      // Fetch blogs
      const blogsRes = await fetch(`${API_BASE_URL}/blogs`, { headers });
      const blogsData = await blogsRes.json();
      setBlogs(blogsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  // Check auth on mount
  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // 1. Inquiry Operations
  const handleUpdateInquiryStatus = async (id, newStatus) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, status: newStatus } : inq));
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Network error updating status');
    }
  };

  const triggerDelete = (title, message, onConfirmAction) => {
    setDeleteConfirm({
      isOpen: true,
      title,
      message,
      onConfirm: onConfirmAction
    });
  };

  const handleDeleteInquiry = (id, name) => {
    triggerDelete(
      "Delete Inquiry Log",
      `Are you sure you want to permanently delete the inquiry log from "${name}"? This action cannot be undone.`,
      async () => {
        const token = localStorage.getItem('adminToken');
        try {
          const response = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setInquiries(prev => prev.filter(inq => inq._id !== id));
          } else {
            alert('Failed to delete inquiry');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // 2. Project Operations
  const handleFeaturedToggle = async (projectId) => {
    const token = localStorage.getItem('adminToken');
    const targetProject = projects.find(p => p._id === projectId);
    if (!targetProject) return;

    const targetState = !targetProject.isFeaturedOnHome;
    // Strict homepage project limiter cap
    const currentlyFeaturedCount = projects.filter(p => p.isFeaturedOnHome && p._id !== projectId).length;
    if (targetState && currentlyFeaturedCount >= 6) {
      alert("Admin cap rule exceeded: Homepage limit is strictly 6 active featured projects!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isFeaturedOnHome: targetState })
      });
      if (response.ok) {
        setProjects(prev => prev.map(proj => proj._id === projectId ? { ...proj, isFeaturedOnHome: targetState } : proj));
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to update project');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setProjectError('');

    if (newProject.isFeaturedOnHome) {
      const currentlyFeaturedCount = projects.filter(p => p.isFeaturedOnHome).length;
      if (currentlyFeaturedCount >= 6) {
        setProjectError("Limiter rule violation: Homepage cap of 6 featured projects already reached.");
        return;
      }
    }

    const token = localStorage.getItem('adminToken');
    const slug = newProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Parse technologies from comma-separated string to string array
    const techArray = newProject.technologies
      ? newProject.technologies.split(',').map(t => t.trim()).filter(t => t !== '')
      : [];

    const payload = { 
      ...newProject, 
      slug,
      technologies: techArray
    };

    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(prev => [...prev, data]);
        setNewProject({
          title: '',
          category: 'Custom Web App',
          shortDescription: '',
          fullDescription: '',
          isFeaturedOnHome: false,
          thumbnailUrl: 'itnexus-mark-color-512px.png',
          timeline: '',
          technologies: '',
          projectUrl: ''
        });
        setShowAddProjectModal(false);
      } else {
        const errData = await response.json();
        setProjectError(errData.message || 'Failed to create project.');
      }
    } catch (err) {
      console.error(err);
      setProjectError('Network error creating project.');
    }
  };

  const handleDeleteProject = (id, title) => {
    triggerDelete(
      "Delete Case Study",
      `Are you sure you want to delete project "${title}"? This will permanently remove the record from the database.`,
      async () => {
        const token = localStorage.getItem('adminToken');
        try {
          const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setProjects(prev => prev.filter(p => p._id !== id));
          } else {
            alert('Failed to delete project');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // 3. Team Operations
  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    setTeamError('');

    // Bio length rule updated to 150 characters
    const bioLength = newMember.shortBio.length;
    if (bioLength < 50 || bioLength > 150) {
      setTeamError(`Bio character rule violation: Bio length is ${bioLength} chars. Must be strictly between 50 and 150 characters.`);
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_BASE_URL}/team`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...newMember, fullBio: newMember.shortBio })
      });

      if (response.ok) {
        const data = await response.json();
        setTeam(prev => [...prev, data]);
        setNewMember({
          name: '',
          role: '',
          shortBio: '',
          imageUrl: 'itnexus-mark-color-512px.png',
          linkedinUrl: ''
        });
        setShowAddTeamModal(false);
      } else {
        const errData = await response.json();
        setTeamError(errData.message || 'Failed to create team member.');
      }
    } catch (err) {
      console.error(err);
      setTeamError('Network error adding team member.');
    }
  };

  // 3.5 Service Operations
  const handleAddService = async (e) => {
    e.preventDefault();
    setServiceError('');
    const token = localStorage.getItem('adminToken');

    // Parse technologies from comma-separated string to string array
    const techArray = newService.technologies
      ? newService.technologies.split(',').map(t => t.trim()).filter(t => t !== '')
      : [];

    // Parse deliverables from newline-separated string to string array
    const deliverablesArray = newService.deliverables
      ? newService.deliverables.split('\n').map(d => d.trim()).filter(d => d !== '')
      : [];

    const payload = {
      title: newService.title,
      description: newService.description,
      icon: newService.icon,
      displayOrder: newService.displayOrder,
      technologies: techArray,
      deliverables: deliverablesArray
    };

    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        setServices(prev => [...prev, data]);
        setNewService({ title: '', description: '', icon: 'Code', displayOrder: 0, technologies: '', deliverables: '' });
        setShowAddServiceModal(false);
      } else {
        const errData = await response.json();
        setServiceError(errData.message || 'Failed to add service');
      }
    } catch (err) {
      console.error(err);
      setServiceError('Network error adding service');
    }
  };

  const handleDeleteService = (id, title) => {
    triggerDelete(
      "Remove Service",
      `Are you sure you want to delete service "${title}" from offerings?`,
      async () => {
        const token = localStorage.getItem('adminToken');
        try {
          const response = await fetch(`${API_BASE_URL}/services/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setServices(prev => prev.filter(s => s._id !== id));
          } else {
            alert('Failed to remove service');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  const handleDeleteTeamMember = (id, name) => {
    triggerDelete(
      "Remove Architect",
      `Are you sure you want to remove team architect profile for "${name}"?`,
      async () => {
        const token = localStorage.getItem('adminToken');
        try {
          const response = await fetch(`${API_BASE_URL}/team/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setTeam(prev => prev.filter(t => t._id !== id));
          } else {
            alert('Failed to remove team member profile');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // 4. Client Operations
  const handleAddClient = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newClient)
      });
      if (response.ok) {
        const data = await response.json();
        setClients(prev => [...prev, data]);
        setNewClient({
          clientName: '',
          logoUrl: 'itnexus-mark-color-512px.png'
        });
        setShowAddClientModal(false);
      } else {
        alert('Failed to add client');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = (id, name) => {
    triggerDelete(
      "Remove Client Partner",
      `Are you sure you want to remove client partner logo for "${name}"?`,
      async () => {
        const token = localStorage.getItem('adminToken');
        try {
          const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setClients(prev => prev.filter(c => c._id !== id));
          } else {
            alert('Failed to remove client logo');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // 3.6 Blog Operations
  const handleAddBlog = async (e) => {
    e.preventDefault();
    setBlogError('');
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBlog)
      });
      if (response.ok) {
        const data = await response.json();
        setBlogs(prev => [...prev, data]);
        setNewBlog({
          title: '',
          type: 'Blog',
          category: 'Engineering',
          shortDescription: '',
          content: '',
          author: 'ITNEXUS Team',
          readTime: '5 min read',
          imageUrl: 'itnexus-mark-color-512px.png',
          displayOrder: 0
        });
        setShowAddBlogModal(false);
      } else {
        const errData = await response.json();
        setBlogError(errData.message || 'Failed to add article');
      }
    } catch (err) {
      console.error(err);
      setBlogError('Network error adding article');
    }
  };

  const handleDeleteBlog = (id, title) => {
    triggerDelete(
      "Remove Article",
      `Are you sure you want to permanently delete the article "${title}"?`,
      async () => {
        const token = localStorage.getItem('adminToken');
        try {
          const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setBlogs(prev => prev.filter(b => b._id !== id));
          } else {
            alert('Failed to remove article');
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAFAFC]">
      {/* Redesigned Fixed Vertical Sidebar */}
      <aside className="w-full lg:w-[280px] bg-brand-navy text-white lg:fixed lg:top-0 lg:bottom-0 lg:left-0 flex flex-col justify-between p-6 z-30 border-r border-slate-800">
        <div className="space-y-8">
          {/* Logo & Header */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center font-bold text-white shadow-md">
              I
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">ITNEXUS Console</h1>
              <p className="text-[10px] text-slate-400 font-mono font-bold">Authorized Session</p>
            </div>
          </div>

          {/* Navigation Tab Links Stacked Vertically */}
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
                activeTab === 'inquiries' 
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/15' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Inquiries Hub ({inquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
                activeTab === 'services' 
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/15' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Services Control ({services.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
                activeTab === 'projects' 
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/15' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Projects Control ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
                activeTab === 'team' 
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/15' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team Control ({team.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
                activeTab === 'clients' 
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/15' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Client Partners ({clients.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
                activeTab === 'blogs' 
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/15' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Blogs & Case Studies ({blogs.length})</span>
            </button>
          </nav>
        </div>

        {/* Log Out button pinned to the bottom */}
        <div className="pt-6 border-t border-slate-850 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-700 text-xs font-bold py-3 rounded-xl border border-slate-700 transition-colors text-white hover:border-red-650"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-grow lg:pl-[280px] p-6 sm:p-10 w-full overflow-x-hidden">
        
        {/* Render Blogs Tab if active */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-brand-navy">Blogs & Case Studies Control Panel</h2>
                <p className="text-xs text-brand-slate">Manage your dynamic articles and case studies.</p>
              </div>
              <button 
                onClick={() => { setBlogError(''); setShowAddBlogModal(true); }}
                className="flex items-center gap-1.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Article
              </button>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-brand-navy font-bold border-b border-slate-200/60 text-xs uppercase tracking-wider">
                    <th className="p-4">Type / Category</th>
                    <th className="p-4">Title / Author</th>
                    <th className="p-4">Short Description</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((b) => (
                    <tr key={b._id} className="border-b border-slate-100 hover:bg-slate-50/50 align-top">
                      <td className="p-4">
                        <span className={`text-[10px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded ${
                          b.type === 'Case Study' ? 'bg-brand-cyan/10 text-brand-blue border border-brand-cyan/20' : 'bg-brand-blue/5 text-brand-blue border border-brand-blue/10'
                        }`}>
                          {b.type}
                        </span>
                        <div className="text-[10px] text-brand-slate mt-1 font-mono">{b.category}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-brand-navy">{b.title}</div>
                        <div className="text-[10px] text-brand-slate mt-0.5">By {b.author} • {b.readTime}</div>
                      </td>
                      <td className="p-4 text-brand-slate text-xs leading-relaxed max-w-xs">{b.shortDescription}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteBlog(b._id, b.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                          title="Remove Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Render Services Tab first inside body if active */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-brand-navy">Services Control Panel</h2>
                <p className="text-xs text-brand-slate">Manage your core offered software solutions.</p>
              </div>
              <button 
                onClick={() => { setServiceError(''); setShowAddServiceModal(true); }}
                className="flex items-center gap-1.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-brand-navy font-bold border-b border-slate-200/60 text-xs uppercase tracking-wider">
                    <th className="p-4">Icon / Title</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Tech & Deliverables</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((svc) => {
                    const IconComponent = iconMap[svc.icon] || Code;
                    return (
                      <tr key={svc._id} className="border-b border-slate-100 hover:bg-slate-50/50 align-top">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-brand-blue/5 text-brand-blue flex items-center justify-center border border-brand-blue/10">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="font-bold text-brand-navy">{svc.title}</div>
                          </div>
                          <div className="text-[10px] text-brand-slate mt-1 font-mono">Order: {svc.displayOrder}</div>
                        </td>
                        <td className="p-4 text-brand-slate text-xs max-w-xs leading-relaxed">{svc.description}</td>
                        <td className="p-4 space-y-2">
                          {svc.technologies && svc.technologies.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-navy font-mono mb-1">Technologies:</div>
                              <div className="flex flex-wrap gap-1">
                                {svc.technologies.map((t, idx) => (
                                  <span key={idx} className="bg-slate-100 text-brand-navy text-[10px] px-1.5 py-0.5 rounded font-mono border border-slate-200/40">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {svc.deliverables && svc.deliverables.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-navy font-mono mb-1">Deliverables:</div>
                              <ul className="list-disc list-inside text-brand-slate text-[10px] space-y-0.5">
                                {svc.deliverables.map((d, idx) => (
                                  <li key={idx}>{d}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDeleteService(svc._id, svc.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                            title="Remove Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* 1. INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-brand-navy">Client Inquiry Pipeline</h2>
                <p className="text-xs text-brand-slate">Review inbound requests sent from public inquiry portals.</p>
              </div>
            </div>

            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div key={inq._id} className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-brand-navy">{inq.clientName}</h3>
                      <p className="text-xs text-brand-slate font-mono">{inq.clientEmail} • {inq.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold font-mono tracking-wider px-2.5 py-1 rounded-md uppercase ${
                        inq.status === 'New' ? 'bg-brand-cyan/10 text-brand-blue border border-brand-cyan/20' :
                        inq.status === 'Reviewed' ? 'bg-brand-navy/5 text-brand-navy border border-brand-navy/15' :
                        'bg-brand-blue/5 text-brand-blue border border-brand-blue/10'
                      }`}>
                        {inq.status}
                      </span>
                      
                      {/* State Workflow updates */}
                      <select 
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                        className="bg-white border border-slate-200 text-xs font-bold rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="New">Set New</option>
                        <option value="Reviewed">Set Reviewed</option>
                        <option value="Responded">Set Responded</option>
                      </select>

                      <button 
                        onClick={() => handleDeleteInquiry(inq._id, inq.clientName)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-1 font-mono">Scope Category: {inq.projectScope}</div>
                    <p className="text-sm text-brand-slate leading-relaxed">{inq.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-brand-navy">Portfolio Case Studies</h2>
                <p className="text-xs text-brand-slate">
                  Manage projects database. Cap of 6 active featured projects strictly enforced.
                </p>
              </div>
              <button 
                onClick={() => { setProjectError(''); setShowAddProjectModal(true); }}
                className="flex items-center gap-1.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-brand-navy font-bold border-b border-slate-200/60 text-xs uppercase tracking-wider">
                    <th className="p-4">Title / Category</th>
                    <th className="p-4">Short Description</th>
                    <th className="p-4">Homepage Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj) => (
                    <tr key={proj._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="font-bold text-brand-navy">{proj.title}</div>
                        <div className="text-[10px] font-mono text-brand-blue tracking-wider uppercase mt-0.5">{proj.category}</div>
                      </td>
                      <td className="p-4 text-brand-slate text-xs max-w-xs truncate">{proj.shortDescription}</td>
                      <td className="p-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={proj.isFeaturedOnHome}
                            onChange={() => handleFeaturedToggle(proj._id)}
                            className="rounded border-slate-350 text-brand-blue focus:ring-brand-blue/20 w-4 h-4"
                          />
                          <span className="text-xs text-brand-slate font-medium">Featured</span>
                        </label>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteProject(proj._id, proj.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                          title="Delete Case Study"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. TEAM TAB */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-brand-navy">Architect Profiles</h2>
                <p className="text-xs text-brand-slate">
                  Manage public profiles. Bios must satisfy 50-70 characters constraints.
                </p>
              </div>
              <button 
                onClick={() => { setTeamError(''); setShowAddTeamModal(true); }}
                className="flex items-center gap-1.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Architect
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <div key={member._id} className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={resolveAssetUrl(member.imageUrl)}
                        alt={member.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <h3 className="font-bold text-brand-navy text-base">{member.name}</h3>
                        <p className="text-xs text-brand-blue font-semibold uppercase">{member.role}</p>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold font-mono text-brand-cyan mb-1.5">BIO BLOCK ({member.shortBio.length} CHARS)</div>
                      <p className="text-xs text-brand-slate leading-relaxed">{member.shortBio}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 text-right">
                    <button 
                      onClick={() => handleDeleteTeamMember(member._id, member.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CLIENTS TAB */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-brand-navy">Brand & Client Partners</h2>
                <p className="text-xs text-brand-slate">Manage logos displayed in the client carousel strip.</p>
              </div>
              <button 
                onClick={() => setShowAddClientModal(true)}
                className="flex items-center gap-1.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Client
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
              {clients.map((client) => (
                <div key={client._id} className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm text-center relative group">
                  <div className="h-12 flex items-center justify-center mb-2">
                    <img 
                      src={resolveAssetUrl(client.logoUrl)} 
                      alt={client.clientName} 
                      className="h-6 max-w-full object-contain grayscale"
                    />
                  </div>
                  <div className="text-xs font-bold text-brand-navy">{client.clientName}</div>
                  
                  <button 
                    onClick={() => handleDeleteClient(client._id, client.clientName)}
                    className="absolute top-2 right-2 p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-opacity opacity-0 group-hover:opacity-100"
                    title="Remove Logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 5. ADD PROJECT MODAL */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddProjectModal(false)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-8 border border-slate-200 z-10 shadow-2xl">
            <h3 className="text-lg font-bold text-brand-navy mb-4">Add Project</h3>
            {projectError && (
              <div className="bg-brand-navy/5 text-brand-navy text-xs p-3 rounded-xl border border-brand-navy/15 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <span>{projectError}</span>
              </div>
            )}
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Title</label>
                <input 
                  type="text" 
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Category</label>
                  <select 
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm bg-white"
                  >
                    <option value="Web Apps">Web Apps</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="Cloud Architecture">Cloud Architecture</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                  </select>
                </div>
                <div>
                  <ImageInputOptions 
                    label="Project Thumbnail" 
                    imageUrl={newProject.thumbnailUrl}
                    onChangeUrl={(val) => setNewProject({...newProject, thumbnailUrl: val})}
                    onFileSelected={(base64) => setNewProject({...newProject, thumbnailUrl: base64})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Short Description</label>
                <input 
                  type="text" 
                  required
                  value={newProject.shortDescription}
                  onChange={(e) => setNewProject({...newProject, shortDescription: e.target.value})}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Project Timeline</label>
                  <input 
                    type="text" 
                    value={newProject.timeline}
                    onChange={(e) => setNewProject({...newProject, timeline: e.target.value})}
                    placeholder="e.g. 3 Months"
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Project URL (Optional)</label>
                  <input 
                    type="text" 
                    value={newProject.projectUrl}
                    onChange={(e) => setNewProject({...newProject, projectUrl: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Key Technologies (Comma separated)</label>
                <input 
                  type="text" 
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                  placeholder="React, Node.js, MongoDB, AWS"
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Full Case Study Narrative</label>
                <textarea 
                  rows="3"
                  required
                  value={newProject.fullDescription}
                  onChange={(e) => setNewProject({...newProject, fullDescription: e.target.value})}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                ></textarea>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input 
                    type="checkbox"
                    checked={newProject.isFeaturedOnHome}
                    onChange={(e) => setNewProject({...newProject, isFeaturedOnHome: e.target.checked})}
                    className="rounded border-slate-350 text-brand-blue w-4 h-4 focus:ring-brand-blue/20"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-navy font-mono">Feature on Homepage</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowAddProjectModal(false)} className="px-4 py-2 text-xs font-bold border rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-brand-blue hover:bg-blue-600 text-white rounded-lg shadow-md">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. ADD TEAM MODAL */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddTeamModal(false)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-8 border border-slate-200 z-10 shadow-2xl">
            <h3 className="text-lg font-bold text-brand-navy mb-4">Add Architect Profile</h3>
            {teamError && (
              <div className="bg-brand-navy/5 text-brand-navy text-xs p-3 rounded-xl border border-brand-navy/15 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <span>{teamError}</span>
              </div>
            )}
            <form onSubmit={handleAddTeamMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Architect Name</label>
                  <input 
                    type="text" 
                    required
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Specialist Role</label>
                  <input 
                    type="text" 
                    required
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    placeholder="e.g. Senior DevOps Engineer"
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <ImageInputOptions 
                    label="Profile Photo" 
                    imageUrl={newMember.imageUrl}
                    onChangeUrl={(val) => setNewMember({...newMember, imageUrl: val})}
                    onFileSelected={(base64) => setNewMember({...newMember, imageUrl: base64})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">LinkedIn URL</label>
                  <input 
                    type="text" 
                    required
                    value={newMember.linkedinUrl}
                    onChange={(e) => setNewMember({...newMember, linkedinUrl: e.target.value})}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy font-mono">Brief Bio (Must be strictly 50-150 chars)</label>
                  <span className={`text-[10px] font-mono font-bold ${
                    newMember.shortBio.length >= 50 && newMember.shortBio.length <= 150 ? 'text-brand-cyan' : 'text-brand-navy'
                  }`}>
                    {newMember.shortBio.length} Characters
                  </span>
                </div>
                <input 
                  type="text" 
                  required
                  value={newMember.shortBio}
                  onChange={(e) => setNewMember({...newMember, shortBio: e.target.value})}
                  placeholder="e.g. Lead full-stack React developer specialized in telemetry pipeline scales."
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowAddTeamModal(false)} className="px-4 py-2 text-xs font-bold border rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-brand-blue hover:bg-blue-600 text-white rounded-lg shadow-md">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. ADD CLIENT MODAL */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddClientModal(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 z-10 shadow-2xl">
            <h3 className="text-lg font-bold text-brand-navy mb-4">Add Brand Client Logo</h3>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Client Name</label>
                <input 
                  type="text" 
                  required
                  value={newClient.clientName}
                  onChange={(e) => setNewClient({...newClient, clientName: e.target.value})}
                  placeholder="e.g. Linear"
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                />
              </div>
              <div>
                <ImageInputOptions 
                  label="Brand Logo" 
                  imageUrl={newClient.logoUrl}
                  onChangeUrl={(val) => setNewClient({...newClient, logoUrl: val})}
                  onFileSelected={(base64) => setNewClient({...newClient, logoUrl: base64})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowAddClientModal(false)} className="px-4 py-2 text-xs font-bold border rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-brand-blue hover:bg-blue-600 text-white rounded-lg shadow-md">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. ADD SERVICE MODAL */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddServiceModal(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200 z-10 shadow-2xl">
            <h3 className="text-lg font-bold text-brand-navy mb-4">Add Dynamic Service</h3>
            {serviceError && (
              <div className="bg-brand-navy/5 text-brand-navy text-xs p-3 rounded-xl border border-brand-navy/15 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <span>{serviceError}</span>
              </div>
            )}
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Service Title</label>
                <input 
                  type="text" 
                  required
                  value={newService.title}
                  onChange={(e) => setNewService({...newService, title: e.target.value})}
                  placeholder="e.g. Machine Learning & AI"
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Select Icon</label>
                  <select 
                    value={newService.icon}
                    onChange={(e) => setNewService({...newService, icon: e.target.value})}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm bg-white"
                  >
                    <option value="Code">Code / Engineering</option>
                    <option value="Palette">Palette / UIUX</option>
                    <option value="Cloud">Cloud / DevOps</option>
                    <option value="Smartphone">Smartphone / Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Display Order</label>
                  <input 
                    type="number" 
                    required
                    value={newService.displayOrder}
                    onChange={(e) => setNewService({...newService, displayOrder: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Service Description</label>
                <textarea 
                  rows="2"
                  required
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  placeholder="Provide a clean short summary of service..."
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Technologies We Deploy (Comma separated)</label>
                <input 
                  type="text" 
                  value={newService.technologies}
                  onChange={(e) => setNewService({...newService, technologies: e.target.value})}
                  placeholder="e.g. React, Node.js, AWS, MongoDB"
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Included Deliverables (One per line)</label>
                <textarea 
                  rows="3"
                  value={newService.deliverables}
                  onChange={(e) => setNewService({...newService, deliverables: e.target.value})}
                  placeholder="e.g. Single-Page Architecture&#10;OAuth2.0 Secure Authentication&#10;RESTful API Development"
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowAddServiceModal(false)} className="px-4 py-2 text-xs font-bold border rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-brand-blue hover:bg-blue-600 text-white rounded-lg shadow-md">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. ADD BLOG MODAL */}
      {showAddBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddBlogModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-8 border border-slate-200 z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-brand-navy mb-4">Add Article (Blog / Case Study)</h3>
            {blogError && (
              <div className="bg-brand-navy/5 text-brand-navy text-xs p-3 rounded-xl border border-brand-navy/15 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <span>{blogError}</span>
              </div>
            )}
            <form onSubmit={handleAddBlog} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Article Title</label>
                  <input 
                    type="text" 
                    required
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                    placeholder="e.g. Scaling WebSockets to 50k Concurrences"
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Category</label>
                  <input 
                    type="text" 
                    required
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                    placeholder="e.g. Engineering, Security, UIUX"
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Type</label>
                  <select 
                    value={newBlog.type}
                    onChange={(e) => setNewBlog({...newBlog, type: e.target.value})}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm bg-white"
                  >
                    <option value="Blog">Blog Post</option>
                    <option value="Case Study">Case Study</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Author</label>
                  <input 
                    type="text" 
                    required
                    value={newBlog.author}
                    onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                    placeholder="ITNEXUS Team"
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Read Time</label>
                  <input 
                    type="text" 
                    required
                    value={newBlog.readTime}
                    onChange={(e) => setNewBlog({...newBlog, readTime: e.target.value})}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Short Summary / Excerpt</label>
                <input 
                  type="text" 
                  required
                  value={newBlog.shortDescription}
                  onChange={(e) => setNewBlog({...newBlog, shortDescription: e.target.value})}
                  placeholder="Provide a single-sentence reader summary..."
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Full Narrative / Content (Markdown supported)</label>
                <textarea 
                  rows="6"
                  required
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                  placeholder="Use # for titles, ## for sections, ### for headers, - for bullets..."
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <ImageInputOptions 
                    label="Banner Image" 
                    imageUrl={newBlog.imageUrl}
                    onChangeUrl={(val) => setNewBlog({...newBlog, imageUrl: val})}
                    onFileSelected={(base64) => setNewBlog({...newBlog, imageUrl: base64})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">Display Order</label>
                  <input 
                    type="number" 
                    required
                    value={newBlog.displayOrder}
                    onChange={(e) => setNewBlog({...newBlog, displayOrder: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowAddBlogModal(false)} className="px-4 py-2 text-xs font-bold border rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-brand-blue hover:bg-blue-600 text-white rounded-lg shadow-md">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 z-10 shadow-2xl space-y-6">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
                <AlertCircle className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">{deleteConfirm.title}</h3>
              <p className="text-xs text-brand-slate leading-relaxed">{deleteConfirm.message}</p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                type="button" 
                onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })} 
                className="px-4 py-2 text-xs font-bold border rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => { deleteConfirm.onConfirm(); setDeleteConfirm({ ...deleteConfirm, isOpen: false }); }} 
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
