import { useState } from 'react';
import { useQuery, useMutation } from '../../api/apollo.js';
import { gql } from '../../api/apollo.js';
import styles from './OwnerPortal.module.css';
import { Building2, Plus, Users, Globe, Mail, Palette, CheckCircle2, AlertCircle } from 'lucide-react';

const LIST_TENANTS = gql`
  query ListTenants {
    listTenants {
      _id
      name
      code
      logoUrl
      primaryColor
    }
  }
`;

const REGISTER_TENANT = gql`
  mutation RegisterTenant($input: TenantRegistrationInput!) {
    registerTenant(input: $input) {
      success
      message
      tenant {
        _id
        name
        code
      }
    }
  }
`;

export default function OwnerPortal() {
  const { data, loading, refetch } = useQuery(LIST_TENANTS);
  const [registerTenant] = useMutation(REGISTER_TENANT);
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    adminUsername: '',
    adminEmail: '',
    adminPassword: 'admin123',
    logoUrl: ''
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Provisioning tenant...' });
    try {
      const { data: res } = await registerTenant({
        variables: { input: form }
      });
      if (res.registerTenant.success) {
        setStatus({ 
          type: 'success', 
          msg: res.registerTenant.message,
          username: form.adminUsername,
          password: form.adminPassword
        });
        setShowForm(false);
        setForm({ name: '', code: '', adminUsername: '', adminEmail: '', adminPassword: 'admin123', logoUrl: '' });
        refetch();
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  };

  if (loading) return <div className={styles.loading}>Loading Platform Data...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>SaaS Control Plane</h1>
          <p className={styles.subtitle}>Manage institutional tenants and platform infrastructure</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Register New College'}
        </button>
      </div>

      {status && (
        <div className={`${styles.status} ${styles[status.type]}`}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {status.msg}
        </div>
      )}

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>College Name</label>
              <input 
                type="text" 
                required 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="e.g. Stanford University"
              />
            </div>
            <div className={styles.field}>
              <label>Unique Code</label>
              <input 
                type="text" 
                required 
                value={form.code} 
                onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                placeholder="e.g. STANFORD"
              />
            </div>
            <div className={styles.field}>
              <label>Admin Username</label>
              <input 
                type="text" 
                required 
                value={form.adminUsername} 
                onChange={e => setForm({...form, adminUsername: e.target.value})}
              />
            </div>
            <div className={styles.field}>
              <label>Admin Email</label>
              <input 
                type="email" 
                required 
                value={form.adminEmail} 
                onChange={e => setForm({...form, adminEmail: e.target.value})}
              />
            </div>
            <div className={styles.field}>
              <label>Admin Password</label>
              <input 
                type="text" 
                required 
                value={form.adminPassword} 
                onChange={e => setForm({...form, adminPassword: e.target.value})}
              />
            </div>
            <div className={styles.field}>
              <label>Logo URL (Optional)</label>
              <input 
                type="text" 
                value={form.logoUrl} 
                onChange={e => setForm({...form, logoUrl: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn}>Start Provisioning</button>
        </form>
      )}

      {status?.type === 'success' && (
        <div className={styles.credentialsBox}>
          <h3>🎉 College Provisioned Successfully!</h3>
          <p>Share these credentials with the college admin:</p>
          <div className={styles.credRow}><strong>Username:</strong> <code>{status.username}</code></div>
          <div className={styles.credRow}><strong>Password:</strong> <code>{status.password}</code></div>
          <div className={styles.credNote}>The college has been bootstrapped with default departments and leave types.</div>
        </div>
      )}

      <div className={styles.grid}>
        {data?.listTenants.map(tenant => (
          <div key={tenant._id} className={styles.card}>
            <div className={styles.cardHeader}>
              {tenant.logoUrl ? (
                <img src={tenant.logoUrl} alt="" className={styles.cardLogo} />
              ) : (
                <div className={styles.logoPlaceholder}><Building2 /></div>
              )}
              <div className={styles.cardBadge}>{tenant.code}</div>
            </div>
            <h3 className={styles.cardName}>{tenant.name}</h3>
            <div className={styles.cardMeta}>
              <div className={styles.metaItem}><Globe size={14} /> Active Status</div>
              <div className={styles.metaItem}><Palette size={14} style={{color: tenant.primaryColor}} /> {tenant.primaryColor}</div>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.viewBtn}>Manage Tenant</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
