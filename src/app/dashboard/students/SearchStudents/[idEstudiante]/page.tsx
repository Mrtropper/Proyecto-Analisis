// src/app/dashboard/students/searchStudents/[idEstudiante]/page.tsx
import StudentDetailView from '../_components/studentDetailView'; 

// Esta función es un Server Component por defecto
export default function StudentDetailPage({ 
    params 
}: { 
    params: { idEstudiante: string } 
}) {
   
    const { idEstudiante: studentId } = params;
    
    return <StudentDetailView studentId={studentId} />;
}
