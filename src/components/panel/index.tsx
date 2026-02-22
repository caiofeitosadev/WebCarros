import { Link } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseConnection';

export function DashboardPanel() {
  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="w-full items-center flex px-5 py-3 bg-red-500 rounded-sm text-white gap-5 mb-5">
      <Link to={'/dashboard'}>Dashboard</Link>
      <Link to={'/dashboard/new-car'}>Cadastrar carro</Link>
      <button className="ml-auto cursor-pointer" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
