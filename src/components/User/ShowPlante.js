import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Common/Loader';
import '../../App.css';

const ShowPlante = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [plantList, setPlantList] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('id_utilisateur'); // Récupérer l'ID de l'utilisateur ici
    const token = localStorage.getItem('token');
    useEffect(() => {
        const fetchPlants = async () => {
            try {

                const response = await fetch("https://arosaje-back.onrender.com/plantes", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Veuillez vous connecter pour visualiser les annonces des autres utilisateurs');
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

    const handleVoirPlusClick = (plante) => {
        navigate(`/plantes/${plante.id_plante}`, { state: { plante } });
    };


    // Filtrer la liste des plantes pour exclure celles appartenant à l'utilisateur connecté
    const filteredPlantList = plantList.filter(plante => {
        const planteUserId = plante.id_utilisateur.toString();
        const currentUserId = userId.toString();
        return planteUserId !== currentUserId;
    });


    return (
        <div>
            <h1>Fil d'actualité</h1>
            <div className="plante-liste">
                {filteredPlantList.map(plante => {
                    const dateCreation = new Date(plante.creele);
                    const dateAffichee = dateCreation.toISOString().split('T')[0];

                    return (
                        <div className="plante-conteneur" key={plante.id_plante}>
                            <img src={plante.url_photo1 || 'default_plant_image.png'} alt={plante.nom_plante} className="plante-photo" />
                            <h3 className="plante-nom">{plante.nom_plante}</h3>
                            <p className="plante-description">{plante.description}</p>
                            <p className="plante-variete"><strong>Variété:</strong> {plante.variete}</p>
                            <p className="plante-date"><strong>Mis en ligne le:</strong> {dateAffichee}</p>
                            <button onClick={() => handleVoirPlusClick(plante)}>Voir plus</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShowPlante;
