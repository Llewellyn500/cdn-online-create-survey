// /path/to/your/SurveyPage.tsx
"use client";
import { useState } from "react";
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import RadioButton from "../../components/RadioButton";
import Checkbox from "../../components/Checkbox";
import FileUpload from "../../components/FileUpload";
import { Survey, SurveyField, RadioButtonField, CheckboxField } from "../../types/survey";

export default function SurveyPage() {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [importMessage, setImportMessage] = useState("Please upload the survey JSON file to start.");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileData = await file.text();
        const parsedSurvey = JSON.parse(fileData);
        setSurvey(parsedSurvey);
        setImportMessage("");
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        alert("Invalid JSON format. Please upload a valid survey JSON file.");
      }
    }
  };

  const validateField = (field: SurveyField, value: any) => {
    let error = "";
    if (field.required && !value) {
      error = `This question is required`;
    } else if (field.type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      error = "Please enter a valid email address";
    }
    return error;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const newErrors: Record<string, string> = {};
    survey?.formFields.forEach((field) => {
      const error = validateField(field, responses[field.question]);
      if (error) {
        newErrors[field.question] = error;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      setSuccessMessage("Survey completed successfully!");
    } else {
      setErrors(newErrors);
    }

    setIsLoading(false);
  };

  if (!survey) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Upload Survey JSON</h1>
        <p className="mb-4">{importMessage}</p>
        <input type="file" accept=".json" onChange={handleFileUpload} className="block" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{survey.title}</h1>
      <h2 className="mb-10">{survey.description}</h2>
      {isLoading && <p>Loading...</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {survey.formFields.map((field, index) => {
          const fieldName = field.question;

          return (
            <div key={index} className="mb-4">
              <label className="block text-lg font-medium mb-2">
                {fieldName}
              </label>
              {field.type === "checkbox" ? (
                <Checkbox
                  options={(field as CheckboxField).options}
                  selectedOptions={responses[fieldName] || []}
                  onChange={(updatedOptions) =>
                    setResponses({ ...responses, [fieldName]: updatedOptions })
                  }
                />
              ) : field.type === "radio" ? (
                <RadioButton
                  options={(field as RadioButtonField).options}
                  selectedOption={responses[fieldName] || ""}
                  onChange={(value) =>
                    setResponses({ ...responses, [fieldName]: value })
                  }
                />
              ) : field.type === "date" ? (
                <input
                  type="date"
                  className="border px-2 py-1 rounded w-full"
                  onChange={(e) =>
                    setResponses({ ...responses, [fieldName]: e.target.value })
                  }
                />
              ) : field.type === "number" ? (
                <input
                  type="number"
                  className="border px-2 py-1 rounded w-full"
                  onChange={(e) =>
                    setResponses({ ...responses, [fieldName]: e.target.value })
                  }
                />
              ) : field.type === "file" ? (
                <FileUpload
                  onChange={(file) => file && setResponses({ ...responses, [fieldName]: file })}
                />
              ) : field.type === "email" ? (
                <input
                  type="email"
                  className="border px-2 py-1 rounded w-full"
                  onChange={(e) =>
                    setResponses({ ...responses, [fieldName]: e.target.value })
                  }
                />
              ) : field.type === "textarea" ? (
                <TextArea
                  onChange={(value) =>
                    setResponses({ ...responses, [fieldName]: value })
                  }
                />
              ) : (
                <TextInput
                  onChange={(value) =>
                    setResponses({ ...responses, [fieldName]: value })
                  }
                />
              )}
              {errors[fieldName] && (
                <p className="text-red-500">{errors[fieldName]}</p>
              )}
            </div>
          );
        })}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit Survey
        </button>
      </form>
    </div>
  );
}
