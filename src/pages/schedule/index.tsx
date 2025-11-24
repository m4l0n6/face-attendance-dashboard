import { useParams } from "react-router-dom";

const SchedulesDetailPage = () => {
    const { scheduleId } = useParams<{ scheduleId: string }>();
    return (
        <div>
            <h1>Schedule Detail Page</h1>
            <p>Schedule ID: {scheduleId}</p>
        </div>
    );
}

export default SchedulesDetailPage;