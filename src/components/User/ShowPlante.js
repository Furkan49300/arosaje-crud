import React, { useState, useEffect } from 'react';
import Loader from '../Common/Loader';
import '../../App.css'

const ShowPlante = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [plantList, setPlantList] = useState([]);

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJndWxvdXBlIiwiaWF0IjoxNzE1ODA4MzczLCJleHAiOjE3MTU4MDk4MTN9.NV4hEfsDDQOG_x0akoFbiIDkt80No6G52Dt_P7l01g8";
                const response = await fetch("http://localhost:8080/plantes", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch plant data');
                }
                const data = await response.json();
                setPlantList(data._embedded.plantes); // Modification ici
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlants();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }


    return (
        <div className="plante-liste">
            {plantList.map(plante => {
                // Extraire la date de création de la plante
                const dateCreation = new Date(plante.creele);
                // Extraire la partie de la date que vous souhaitez afficher
                const dateAffichee = dateCreation.toISOString().split('T')[0];

                return (
                    <div className="plante-conteneur" key={plante.id_plante}>
                        <img src={plante.url_photo1 || 'default_plant_image.png'} alt={plante.nom_plante} className="plante-photo" />
                        <h3 className="plante-nom">{plante.nom_plante}</h3>
                        <p className="plante-description">{plante.description}</p>
                        <p className="plante-variete"><strong>Variété:</strong> {plante.variete}</p>
                        <p className="plante-date"><strong>Mis en ligne le:</strong> {dateAffichee}</p>
                        <button>Voir plus</button>
                    </div>
                );
            })}
        </div>
    );

};

export default ShowPlante;
