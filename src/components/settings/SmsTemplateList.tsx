
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SmsTemplateList = () => {
  const navigate = useNavigate();
  const templates = [
    { id: 1, name: 'Booking Confirmation', message: 'Your booking is confirmed' },
    { id: 2, name: 'Check-in Reminder', message: 'Your check-in is tomorrow' },
    { id: 3, name: 'Check-out Reminder', message: 'Check-out reminder' },
  ];

  const handleEdit = (id: number) => {
    // Navigate to the edit page
    navigate(`/settings/sms-templates/edit/${id}`);
  };

  const handleAddTemplate = () => {
    navigate('/settings/sms-templates/new');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAddTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left font-medium p-3">Template Name</th>
              <th className="text-left font-medium p-3">Message</th>
              <th className="text-right font-medium p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.id} className="border-t">
                <td className="p-3 font-medium">{template.name}</td>
                <td className="p-3">{template.message}</td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(template.id)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SmsTemplateList;
