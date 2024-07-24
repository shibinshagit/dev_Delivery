import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const LeaveForm = ({ orderId }) => {
    const [leaveStart, setLeaveStart] = useState('');
    const [leaveEnd, setLeaveEnd] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
      
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Leave Start Date:</label>
                <input
                    type="date"
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Leave End Date:</label>
                <input
                    type="date"
                    value={leaveEnd}
                    onChange={(e) => setLeaveEnd(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Leave</button>
        </form>
    );
};

export default LeaveForm;
