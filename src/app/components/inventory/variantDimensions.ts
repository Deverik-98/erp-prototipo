/** Dimensiones de variante reutilizables (retail, lácteos, tecnología, etc.). */
export const VARIANT_DIMENSION_OPTIONS = [
  { value: "talla", label: "Talla" },
  { value: "color", label: "Color" },
  { value: "sabor", label: "Sabor / aroma" },
  { value: "peso_volumen", label: "Peso o volumen" },
  { value: "medida", label: "Medida (largo, ancho…)" },
  { value: "material", label: "Material" },
  { value: "modelo", label: "Modelo / estilo" },
  { value: "capacidad", label: "Capacidad (ml, GB, unid.)" },
  { value: "custom", label: "Otro (nombre libre)" },
] as const;

export type VariantDimensionValue = (typeof VARIANT_DIMENSION_OPTIONS)[number]["value"];

export function dimensionLabel(value: VariantDimensionValue, customName: string) {
  if (value === "custom") {
    return customName.trim() || "Atributo";
  }
  const opt = VARIANT_DIMENSION_OPTIONS.find((o) => o.value === value);
  return opt?.label ?? value;
}
