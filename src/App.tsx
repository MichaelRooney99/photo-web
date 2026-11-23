import { useEffect, useState } from "react";

type Photo = {
  imageUrl: string;
  alt: string;
  description: string;
  photographer: string;
  photographerUrl: string;
  photoUrl: string;
};

const API_URL = import.meta.env.VITE_API_URL;
const UTM = "?utm_source=scwr-lab&utm_medium=referral";



async function getPhotos(topic?: string): Promise<Photo[]> {
  const query = topic === undefined ? "" : `&topic=${encodeURIComponent(topic)}`;
  const res = await fetch(`${API_URL}photo?count=5${query}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error ?? `API returned ${res.status}`);
  return data;
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);

  const [index, setIndex] = useState(0);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    getPhotos()
      .then(setPhotos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const prevIndex = (index - 1 + photos.length) % photos.length;
  const nextIndex = (index + 1) % photos.length;
  const photo = photos[index];

  const prev = () => setIndex(prevIndex);
  const next = () => setIndex(nextIndex);

  const sidePhoto = (i: number, onClick: () => void) => (
    <img
      src={photos[i].imageUrl}
      alt={photos[i].alt}
      onClick={onClick}
      style={{ width: "20%", aspectRatio: "3 / 2", objectFit: "cover", opacity: 0.5, cursor: "pointer" }}
    />
  );

  return (
    <main style={{ maxWidth: "48rem", margin: "2rem auto", padding: "0 1rem" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          getPhotos(topic)
            .then((data) => {
              setPhotos(data);
              setIndex(0);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        }}
      >
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Type a topic" />
        <button disabled={loading}>Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Something went wrong: {error}</p>}

      {photo && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {photos.length > 1 && sidePhoto(prevIndex, prev)}
            <img
              src={photo.imageUrl}
              alt={photo.alt}
              style={{ width: photos.length > 1 ? "60%" : "100%", aspectRatio: "3 / 2", objectFit: "cover" }}
            />
            {photos.length > 1 && sidePhoto(nextIndex, next)}
          </div>

          {/* <p>
            <button onClick={prev}>‹ Prev</button> {index + 1} / {photos.length}{" "}
            <button onClick={next}>Next ›</button>
          </p> */}
          <br />
          
          <p>{photo.description}</p>
          
          <p>
            Photo by <a href={photo.photographerUrl + UTM}>{photo.photographer}</a> on{" "}
            <a href={"https://unsplash.com/" + UTM}>Unsplash</a>
          </p>
        </>
      )}
    </main>
  );
}

// export default function App() {
//   const [photo, setPhoto] = useState<Photo | null>(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetch(`${API_URL}photo`)
//       .then((res) => {
//         if (!res.ok) throw new Error(`API returned ${res.status}`);
//         return res.json();
//       })
//       .then(setPhoto)
//       .catch((err) => setError(err.message));
//   }, []);

//   if (error) return <p>Something went wrong: {error}</p>;
//   if (!photo) return <p>Loading...</p>;

//   return (
//     <main style={{ maxWidth: "48rem", margin: "2rem auto", padding: "0 1rem" }}>
//       <img src={photo.imageUrl} alt={photo.alt} style={{ maxWidth: "100%" }} />
//       <p>{photo.description}</p>
//       <p>
//         Photo by <a href={photo.photographerUrl + UTM}>{photo.photographer}</a> on{" "}
//         <a href={"https://unsplash.com/" + UTM}>Unsplash</a>
//       </p>
//     </main>
//   );
// }
