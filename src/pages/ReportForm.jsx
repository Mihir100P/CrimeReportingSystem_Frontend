import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { reportsApi } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

const ReportForm = () => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const createReportMutation = useMutation({
    mutationFn: (formData) => reportsApi.createReport(formData),
    onSuccess: () => {
      reset();
      setFiles([]);
      setPreviewUrls([]);
      setLocation(null);
      setAddress("");
      setSubmitError("");
      navigate("/dashboard", { state: { success: true, message: "Report submitted successfully" } });
    },
    onError: (error) => {
      setSubmitError(error.response?.data?.message || "Failed to submit report");
      setIsSubmitting(false);
    },
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latlng = { lat: position.coords.latitude, lng: position.coords.longitude };
          setLocation(latlng);
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
            const data = await response.json();
            setAddress(data.display_name || "Unknown location");
          } catch (error) {
            setAddress("Unable to determine address"+error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const onSubmit = async (data) => {
    if (!location) {
      setSubmitError("Unable to get current location");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("incidentType", data.incidentType);
    formData.append("latitude", location.lat);
    formData.append("longitude", location.lng);
    formData.append("address", address);
    files.forEach((file) => {
      formData.append("media", file);
    });
    createReportMutation.mutate(formData);
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Report an Incident</h1>
      {submitError && <div className="alert alert-danger">{submitError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Incident Title</label>
          <input type="text" className="form-control" {...register("title", { required: "Title is required" })} />
          {errors.title && <div className="text-danger">{errors.title.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Incident Type</label>
          <select className="form-select" {...register("incidentType", { required: "Incident type is required" })}>
            <option value="">Select incident type</option>
            <option value="theft">Theft</option>
            <option value="assault">Assault</option>
            <option value="burglary">Burglary</option>
            <option value="vandalism">Vandalism</option>
            <option value="fraud">Fraud</option>
            <option value="harassment">Harassment</option>
            <option value="Voilent">Voilent</option>
            <option value="Traffic offense">Traffic offense</option>
            <option value="suspicious">Suspicious Activity</option>
            <option value="other">Other</option>
          </select>
          {errors.incidentType && <div className="text-danger">{errors.incidentType.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="4" {...register("description", { required: "Description is required" })}></textarea>
          {errors.description && <div className="text-danger">{errors.description.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Upload Media (Image/Video)</label>
          <input type="file" className="form-control" accept="image/*,video/*" multiple onChange={handleFileChange} />
          <div className="mt-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="mt-2">
                <img src={url} alt="Preview" className="img-thumbnail" style={{ maxWidth: "150px" }} />
              </div>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <p>{address || "Fetching current location..."}</p>
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;


