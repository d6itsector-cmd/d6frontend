import AdminMessages from "../../components/Admin/Messages/AdminMessages";

const MessagesAdmin = () => {
  return (
    <div className="clients-page">
      <div className="page-header">
        <div>
          <h1>Messages</h1>
          <p>Conversations with your clients.</p>
        </div>
      </div>

      <AdminMessages />
    </div>
  );
};

export default MessagesAdmin;
