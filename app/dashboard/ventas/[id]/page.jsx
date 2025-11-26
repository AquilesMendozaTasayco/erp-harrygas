import DetalleVentaClient from "./DetalleVentaClient";

export default async function Page({ params }) {
  const resolved = await params;
  const { id } = resolved;

  return <DetalleVentaClient id={id} />;
}
