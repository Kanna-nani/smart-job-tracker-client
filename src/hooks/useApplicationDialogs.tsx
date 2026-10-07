import { useCallback, useState } from 'react';
import ApplicationDetails from '../components/applications/ApplicationDetails';
import ApplicationForm from '../components/applications/ApplicationForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import type { ApplicationInput, JobApplication } from '../types/application';
import { useApplications } from './useApplications';

interface FormState {
  open: boolean;
  /** Incremented on every open so the form remounts with fresh values. */
  session: number;
  editing?: JobApplication;
}

/**
 * Wires the add/edit form, details drawer and delete confirmation to the
 * applications store. Pages render `dialogs` once and call the openers.
 */
export function useApplicationDialogs() {
  const { applications, addApplication, updateApplication, deleteApplication } = useApplications();

  const [form, setForm] = useState<FormState>({ open: false, session: 0 });
  const [details, setDetails] = useState<{ open: boolean; application: JobApplication | null }>({
    open: false,
    application: null,
  });
  const [deleteState, setDeleteState] = useState<{ open: boolean; application: JobApplication | null }>({
    open: false,
    application: null,
  });

  const openAdd = useCallback(() => setForm((prev) => ({ open: true, session: prev.session + 1 })), []);
  const openEdit = useCallback(
    (application: JobApplication) => setForm((prev) => ({ open: true, session: prev.session + 1, editing: application })),
    [],
  );
  const openDetails = useCallback((application: JobApplication) => setDetails({ open: true, application }), []);
  const requestDelete = useCallback(
    (application: JobApplication) => setDeleteState({ open: true, application }),
    [],
  );

  const closeForm = () => setForm((prev) => ({ ...prev, open: false }));

  const handleSubmit = (input: ApplicationInput) => {
    if (form.editing) updateApplication(form.editing._id, input);
    else addApplication(input);
    closeForm();
  };

  const handleConfirmDelete = () => {
    const target = deleteState.application;
    if (target) {
      deleteApplication(target._id);
      if (details.application?._id === target._id) setDetails((prev) => ({ ...prev, open: false }));
    }
    setDeleteState((prev) => ({ ...prev, open: false }));
  };

  // Resolve against live data so edits show immediately; fall back to the
  // snapshot so content stays visible while a deleted item's drawer closes.
  const liveDetails = details.application
    ? (applications.find((a) => a._id === details.application!._id) ?? details.application)
    : null;

  const dialogs = (
    <>
      <ApplicationForm
        key={form.session}
        open={form.open}
        application={form.editing}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
      <ApplicationDetails
        open={details.open}
        application={liveDetails}
        onClose={() => setDetails((prev) => ({ ...prev, open: false }))}
        onEdit={openEdit}
        onDelete={requestDelete}
      />
      <ConfirmDialog
        open={deleteState.open}
        destructive
        title="Delete application?"
        description={
          deleteState.application ? (
            <>
              <strong>
                {deleteState.application.companyName} — {deleteState.application.jobTitle}
              </strong>{' '}
              will be removed from your tracker. You can undo this right after.
            </>
          ) : null
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteState((prev) => ({ ...prev, open: false }))}
      />
    </>
  );

  return { dialogs, openAdd, openEdit, openDetails, requestDelete };
}
