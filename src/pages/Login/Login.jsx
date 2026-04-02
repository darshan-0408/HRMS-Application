import styles from './Login.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, Lock, User } from 'lucide-react';
import { useMutation } from '../../api/apollo.js';
import { LOGIN_MUTATION } from '../../api/authQueries.js';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [login] = useMutation(LOGIN_MUTATION);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please enter username and password.');
      return;
    }
    setLoading(true);
    
    try {
      const { data } = await login({
        variables: {
          username: form.username,
          password: form.password
        }
      });

      const { token, user } = data.login;
      
      localStorage.setItem('hrms_token', token);
      localStorage.setItem('tenant_id', user.tenant_id);
      localStorage.setItem('tenant_name', user.tenant?.name || 'University');
      localStorage.setItem('tenant_logo', user.tenant?.logoUrl || '');
      localStorage.setItem('tenant_color', user.tenant?.primaryColor || '');
      localStorage.setItem('user_data', JSON.stringify(user));

      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Left Panel */}
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}><Building2 size={28} /></div>
            <span className={styles.brandName}>HRMS</span>
          </div>
          <h1 className={styles.headline}>
            Manage your workforce<br />with confidence
          </h1>
          <p className={styles.subtext}>
            A complete HR management solution for attendances, leaves, movements, and approvals — all in one place.
          </p>
          <div className={styles.features}>
            {['Employee Management', 'Leave & Attendance Tracking', 'Approval Workflows', 'Real-time Dashboard'].map((f) => (
              <div key={f} className={styles.feature}>
                <div className={styles.featureDot} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.lockIcon}><Lock size={20} /></div>
            <h2 className={styles.cardTitle}>Admin Login</h2>
            <p className={styles.cardSub}>Sign in to your admin account</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.inputIcon} />
                <input
                  id="username"
                  className={`form-input ${styles.input}`}
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  id="password"
                  className={`form-input ${styles.input}`}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
          </form>

          <p className={styles.hint}>
            Try: <strong>admin_univ_a</strong> or <strong>admin_heritage</strong><br/>
            Pass: <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
