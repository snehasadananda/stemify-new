import { useEffect, useState } from "react";
import VikiLayout from "../../components/viki/VikiLayout";
import "./UserManagement.css";

export default function UserManagement() {

  const [tab, setTab] = useState("internal");
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, [tab]);

  const load = async () => {

    const url =
      tab === "internal"
        ? "/api/users/internal/list"
        : "/api/users/schools/list";

    const res = await fetch(url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    setList(await res.json());
  };

  const suspend = async (id) => {
    await fetch(`/api/users/suspend/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    load();
  };

  return (
    <VikiLayout>

      <h2>User Management</h2>

      <div className="cards">
        <button onClick={()=>setTab("internal")}>
          Internal Users
        </button>

        <button onClick={()=>setTab("school")}>
          School Admins
        </button>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>Name</th>
            <th>{tab==="internal"?"Role":"School"}</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
        {list.map(u=>(
          <tr key={u.id}>
            <td>{u.name}</td>

            <td>
              {tab==="internal"
                ? u.role
                : u.school_name}
            </td>

            <td>
              {u.is_active?"Active":"Suspended"}
            </td>

            <td>
              <button onClick={()=>suspend(u.id)}>
                {u.is_active?"Suspend":"Activate"}
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

    </VikiLayout>
  );
}
