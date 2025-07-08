
import { MediaEntryForm } from "@/components/MediaEntryForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AddEntry = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast({
      title: "Entry Added!",
      description: "Your media entry has been saved successfully.",
    });
    // Optionally navigate to dashboard or entries list
    // navigate("/dashboard");
  };

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Add Entry</h1>
        <p className="text-muted-foreground">Add a new media item to your collection</p>
      </div>

      <MediaEntryForm onSuccess={handleSuccess} />
    </div>
  );
};

export default AddEntry;
