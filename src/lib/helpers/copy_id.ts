interface HasId {
  _id: string;
}

function copy_id() {
  const handleCopyId = async (item: HasId) => {
    try {
      await navigator.clipboard.writeText(item._id);
    } catch {
      // Preserve the existing silent clipboard failure behavior.
    }
  };

  return handleCopyId;
}

export { copy_id };

export type { HasId };
