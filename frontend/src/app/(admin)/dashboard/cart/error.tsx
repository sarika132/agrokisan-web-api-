"use client";

export default function Error({ error }: { error: Error }) {
    return (
        <div className= "p-6" >
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" >
            <p className="text-red-600 font-medium" > Something went wrong </p>
                < p className = "text-red-400 text-sm mt-1" > { error.message } </p>
                    </div>
                    </div>
  );
}