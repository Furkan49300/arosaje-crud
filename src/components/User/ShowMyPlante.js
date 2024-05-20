import React, { useState, useEffect } from 'react';
import Loader from '../Common/Loader';
import '../../App.css';

const ShowMyPlante = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [plantList, setPlantList] = useState([]);

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const userId = localStorage.getItem('id_utilisateur');
                if (!userId) {
                    throw new Error('User ID not found in localStorage');
                }

                const token = localStorage.getItem('token');
                const url = `http://localhost:8080/plantes/utilisateur/${userId}`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Veuillez vous connecter pour visualiser vos plantes');
                }
                const data = await response.json();
                setPlantList(data);
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
        <div>
            <h1>Mes plantes</h1>
            <div className="plante-liste">
                {plantList.map(plante => {
                    const dateCreation = new Date(plante.creele);
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
        </div>
    );
};

export default ShowMyPlante;
