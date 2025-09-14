import Layout from "@/components/Layout";
import {useState, useEffect} from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Admins({swal}) {
  const [email, setEmail] = useState('');
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  function fetchAdmins() {
    axios.get('/api/admins').then(result => {
      setAdmins(result.data);
    });
  }

  async function addAdmin(ev) {
    ev.preventDefault();
    if (!email) {
      swal.fire({
        title: 'Error',
        text: 'Please enter an email address',
        icon: 'error',
      });
      return;
    }
    
    try {
      await axios.post('/api/admins', {email});
      setEmail('');
      fetchAdmins();
      swal.fire({
        title: 'Success',
        text: 'Admin added successfully',
        icon: 'success',
      });
    } catch (error) {
      swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add admin',
        icon: 'error',
      });
    }
  }

  function removeAdmin(admin) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to remove ${admin.email}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        await axios.delete('/api/admins?_id='+admin._id);
        fetchAdmins();
        swal.fire({
          title: 'Deleted!',
          text: 'Admin has been removed.',
          icon: 'success',
        });
      }
    });
  }

  return (
    <Layout>
      <h1>Admins</h1>
      <form onSubmit={addAdmin}>
        <label>Add new admin</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="mb-0"
            value={email}
            onChange={ev => setEmail(ev.target.value)}
            placeholder="google email" />
          <button
            type="submit"
            className="btn-primary whitespace-nowrap">
            Add admin
          </button>
        </div>
      </form>

      <h2>Existing admins</h2>
      <table className="basic">
        <thead>
          <tr>
            <th>Admin Google Email</th>
            <th>Date created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {admins.length > 0 && admins.map(admin => (
            <tr key={admin._id}>
              <td>{admin.email}</td>
              <td>
                {admin.createdAt && new Date(admin.createdAt).toLocaleString()}
              </td>
              <td>
                <button
                  onClick={() => removeAdmin(admin)}
                  className="btn-red">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({swal}, ref) => (
  <Admins swal={swal} />
));
