import '../../Home/home.css';
import { LogOut } from 'lucide-react';


function Logout() {

    const LogOutClick = (e) => {
        fetch('http://localhost:8082/api/logout', {
            method: "POST",
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                window.location.href="/login"
            } else {
                throw new Error('Błąd podczas wylogowywania');
            }
        })
        .catch(error => {
            console.error("Błąd:", error);
        });
    }



  return (
   <div className='logout-content' onClick={LogOutClick}>
        <LogOut></LogOut>
        <p>Log Out</p>
   </div>
  );
}

export default Logout;
