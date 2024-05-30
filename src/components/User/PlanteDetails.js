import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Importez useNavigate
import '../../App.css';
import Chat from './Chat'; // Assurez-vous que le chemin est correct

const PlanteDetails = () => {
    const location = useLocation();
    const Navigate = useNavigate(); // Utilisez useNavigate pour naviguer
    const { plante } = location.state;

    const dateCreation = new Date(plante.creele);
    const dateAffichee = dateCreation.toISOString().split('T')[0];

    const userId = localStorage.getItem('id_utilisateur');
    const [reservationId, setReservationId] = useState(null);
    const [reservationDetails, setReservationDetails] = useState(null);
    const [message, setMessage] = useState('');
    const [comment, setComment] = useState('');
    const [conseils, setConseils] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (plante.reservation && plante.reservation.id_reservation) {
                    setReservationId(plante.reservation.id_reservation);
                    console.log('ID de réservation:', plante.reservation.id_reservation);
                } else {
                    console.log('ID de réservation non trouvé');
                }

                const fetchReservationDetails = async () => {
                    if (reservationId) {
                        const response = await fetch(`https://arosaje-back.onrender.com/reservations/${reservationId}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (!response.ok) {
                            throw new Error('Failed to fetch reservation details');
                        }

                        const data = await response.json();
                        setReservationDetails(data);

                        if (data.etat == 1) {
                            setMessage('Déjà réservé');
                        }
                    }
                };

                const fetchConseils = async () => {
                    const response = await fetch(`https://arosaje-back.onrender.com/api/conseils/plante/${plante.id_plante}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch conseils');
                    }

                    const data = await response.json();
                    setConseils(data);
                };

                await Promise.all([fetchReservationDetails(), fetchConseils()]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [reservationId, plante.id_plante, token]);

    const handleReservation = async () => {
        console.log('User ID:', userId);
        console.log('Reservation ID:', reservationId);

        if (token) {
            try {
                const response = await fetch(`https://arosaje-back.onrender.com/reservations/${reservationId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id_utilisateur: parseInt(userId),
                        etat: true
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to make reservation');
                }

                const data = await response.json();
                setMessage('Réservation réussie!');
                console.log('Réponse de la réservation:', data);
            } catch (error) {
                setMessage('Réservation confirmée.');
            }
        } else {
            console.error('Token not available');
        }
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleCommentSubmit = async () => {
        const id_plante = plante.id_plante;

        if (token) {
            const conseilData = {
                id_utilisateur: parseInt(userId),
                id_plante: parseInt(id_plante),
                contenu: comment
            };

            console.log(conseilData);

            try {
                const response = await fetch('https://arosaje-back.onrender.com/api/conseils/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(conseilData),
                });

                if (!response.ok) {
                    throw new Error('Failed to post comment');
                }

                const conseilsResponse = await fetch(`https://arosaje-back.onrender.com/api/conseils/plante/${plante.id_plante}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const conseilsData = await conseilsResponse.json();
                setConseils(conseilsData);
            } catch (error) {
                console.error('Error posting comment:', error);
            }
        } else {
            console.error('Token not available');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Détails de la Plante</h1>
            <div className='plante-vertical'>
                <img src={plante.url_photo1 || 'default_plant_image.png'} alt={plante.nom_plante} className="plante-photo" />
                <img src={plante.url_photo2 || 'default_plant_image.png'} alt={plante.nom_plante} className="plante-photo" />
                <img src={plante.url_photo3 || 'default_plant_image.png'} alt={plante.nom_plante} className="plante-photo" />
            </div>
            <div className="plante-conteneur">
                <h3 className="plante-nom">{plante.nom_plante}</h3>
                <p className="plante-description">{plante.description}</p>
                <p className="plante-variete"><strong>Variété:</strong> {plante.variete}</p>
                <p className="plante-date"><strong>Mis en ligne le:</strong> {dateAffichee}</p>
                {reservationDetails && (
                    <>
                        <p className="reservation-date"><strong>Date de début:</strong> {new Date(reservationDetails.dateDebut).toISOString().split('T')[0]}</p>
                        <p className="reservation-date"><strong>Date de fin:</strong> {new Date(reservationDetails.dateFin).toISOString().split('T')[0]}</p>
                    </>
                )}
                {reservationDetails && reservationDetails.etat == 0 && (
                    <button onClick={handleReservation}>Réserver</button>
                )}
                {message && <p>{message}</p>}
            </div>

            <div className="comment-section">
                <h4>Poste un conseil pour la communauté</h4>
                <textarea
                    className="comment-input"
                    placeholder="Ajouter un commentaire..."
                    value={comment}
                    onChange={handleCommentChange}
                />
                <button className="comment-button" onClick={handleCommentSubmit}>
                    Commenter
                </button>
                <div className="conseils-list">
                    <h4>Conseils</h4>
                    {conseils.map(conseil => (
                        <div key={conseil.id_conseil} className="conseil-item">
                            <p>{conseil.contenu}</p>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={() => Navigate(`/chat/${userId}/${plante.id_utilisateur}`)}>Contacter</button>
        </div>
    );
};

export default PlanteDetails;
