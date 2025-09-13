import React, {useEffect, useState} from 'react';

type Workflow = {
  id: string;
  name: string;
  description?: string;
  author?: string;
};

interface ComfyWorkflowListProps {
  serverUrl: string;
  onSelectWorkflow: (workflow: Workflow) => void;
}

export default function ComfyWorkflowList({serverUrl, onSelectWorkflow}: ComfyWorkflowListProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${serverUrl}/api/workflows`)
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        setWorkflows(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [serverUrl]);

  if (loading) return <div>Loading workflows...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Available ComfyUI Workflows</h3>
      <ul>
        {workflows.map(wf => (
          <li key={wf.id}>
            <strong>{wf.name}</strong> by {wf.author || "unknown"}
            <button onClick={() => onSelectWorkflow(wf)} style={{ marginLeft: '10px' }}>
              Use
            </button>
            {wf.description && <p>{wf.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
