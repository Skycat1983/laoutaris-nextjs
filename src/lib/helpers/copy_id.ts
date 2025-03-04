interface HasId {
  _id: string;
}

export function copy_id() {
  const handleCopyId = async (item: HasId) => {
    try {
      await navigator.clipboard.writeText(item._id);
      console.log("Copied ID:", item._id);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return handleCopyId;
}

export default copy_id;
