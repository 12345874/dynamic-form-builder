import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DynamicForm.css";
import type { Field, FormData, FormSchema } from "../types/schema";

const DynamicForm: React.FC = () => {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    department: "",
    programmingLanguage: "",
    experience: "",
    remoteWork: false,
    startDate: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await axios.get(
          "https://sharejson.com/api/v1/uzjxOUc_5VccqT-1XiEYf"
        );
        setSchema(response.data);
      } catch (error) {
        console.error("Error fetching schema", error);
      }
    };
    fetchSchema();
  }, []);

  console.log("Form Schema:", schema);

  const handleChange = (name: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  console.log("Form Data:", formData);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    schema?.fields.forEach((field) => {
      const fieldName = field.id;
      const value = formData[fieldName];
      if (field.validation) {
        for (const rule of field.validation) {
          if (rule.type === "required" && !value) {
            newErrors[fieldName] = rule.message;
          } else if (
            rule.type === "minLength" &&
            typeof value === "string" &&
            typeof rule.value === "number" &&
            value.length < rule.value
          ) {
            newErrors[fieldName] = rule.message;
          }
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const shouldShowField = (field: Field) => {
    if (!field.dependsOn) return true;
    return formData[field.dependsOn.fieldId] === field.dependsOn.value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Form Submitted! Check console for data.");
      console.log("Submitted Data:", formData);
    }
  };

  console.log("Errors:", errors);

  if (!schema) return <p>Loading form...</p>;

  return (
    <>
      <h1 className="form-title">{schema.title}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {schema.fields.map((field) => {
          const fieldName = field.id;
          return (
            shouldShowField(field) && (
              <div key={fieldName} className="form-group">
                <label>{field.label}</label>
                {field.type === "text" ||
                field.type === "number" ||
                field.type === "date" ? (
                  <input
                    type={field.type}
                    name={fieldName}
                    placeholder={field.placeholder || ""}
                    value={
                      typeof formData[fieldName] === "string" ||
                      typeof formData[fieldName] === "number"
                        ? formData[fieldName]
                        : ""
                    }
                    onChange={(e) => handleChange(fieldName, e.target.value)}
                    onClick={(e) => {
                      if (field.type === "date") {
                        (e.target as HTMLInputElement).showPicker?.();
                      }
                    }}
                  />
                ) : field.type === "select" && field.options ? (
                  <select
                    name={fieldName}
                    value={
                      typeof formData[fieldName] === "string" ||
                      typeof formData[fieldName] === "number"
                        ? formData[fieldName]
                        : ""
                    }
                    onChange={(e) => handleChange(fieldName, e.target.value)}
                  >
                    <option value="">Select</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={!!formData[fieldName]}
                    onChange={(e) => handleChange(fieldName, e.target.checked)}
                  />
                ) : null}
                {errors[fieldName] && (
                  <span className="error">{errors[fieldName]}</span>
                )}
              </div>
            )
          );
        })}
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </>
  );
};

export default DynamicForm;
