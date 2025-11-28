import './App.css';
// import RegisterTutor from './RegisterTutor'; // Cái nào không dùng thì comment
import Layout from './Layout'; // <--- QUAN TRỌNG: Bỏ comment dòng này
import TutorFreeSlot from './TutorFreeSlot'; 
// import AppointmentBooking from './AppointmentBooking';

function App() {
  return (
    <Layout>
      <TutorFreeSlot />
    </Layout>
  );
}

export default App;