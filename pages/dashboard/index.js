import { useEffect } from 'react';
import { useRouter } from 'next/router';
import storage from '../../lib/services/storage';

const DashBoard = () => {
  const router = useRouter();

  useEffect(() => {
    if(!storage.getToken()){
      router.push('/login')
    }

    if(storage.getRole()){
      router.push(`/dashboard/${storage.getRole()}`)
    }
  }, [])

  return null;
};

export default DashBoard;
