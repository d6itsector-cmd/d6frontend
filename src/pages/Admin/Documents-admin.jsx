import DocumentManagementTable from "../../components/Admin/Documents/DocumentManagementTable";

const DocumentsAdmin = () => {
  return (
    <div className="clients-page">
      <div className="page-header">
        <div>
          <h1>Documents</h1>
          <p>Upload and manage client-facing files.</p>
        </div>
      </div>

      <DocumentManagementTable />
    </div>
  );
};

export default DocumentsAdmin;
