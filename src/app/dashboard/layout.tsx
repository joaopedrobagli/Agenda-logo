// O layout envolve todas as páginas do dashboard automaticamente
// Não precisa mexer em nenhuma outra página!

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      {/* O children é o conteúdo de cada página */}
      {/* A sidebar já está em cada página, então só adicionamos o ml-56 no conteúdo */}
      <div className="flex-1 ml-56">
        {children}
      </div>
    </div>
  );
}