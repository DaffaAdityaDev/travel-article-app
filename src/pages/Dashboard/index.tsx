import Dashboard from '../../components/Dashboard';

function index() {
  console.log(localStorage.getItem('authToken'));
  return (
    <div>
      {/* <Welcome/> */}
      <Dashboard/>
    </div>
  )
}

export default index