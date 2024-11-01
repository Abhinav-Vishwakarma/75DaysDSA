import React, { useEffect, useState } from 'react';

function Data() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/getUser');
            const result = await response.json();
            setData(result);
        };
        fetchData();
    }, []);
    console.log(data);
    return (
        <div>
            <h1>Data from MongoDB</h1>
            <ul>
                {data.map(item => (
                    <li key={item._id}>{item.username}</li> // Change 'name' to your actual field
                ))}
            </ul>
        </div>
    );
}

export default Data;
