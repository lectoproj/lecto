export const metadata = {
  title: 'Inicio | Lecto'
};

export default async function DefaultPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Inicio</h1>
      </div>
    </main>
  );
}
