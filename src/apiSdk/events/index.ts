import axios from 'axios';
import queryString from 'query-string';
import { EventInterface, EventGetQueryInterface } from 'interfaces/event';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getEvents = async (query?: EventGetQueryInterface): Promise<PaginatedInterface<EventInterface>> => {
  const response = await axios.get('/api/events', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createEvent = async (event: EventInterface) => {
  const response = await axios.post('/api/events', event);
  return response.data;
};

export const updateEventById = async (id: string, event: EventInterface) => {
  const response = await axios.put(`/api/events/${id}`, event);
  return response.data;
};

export const getEventById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/events/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEventById = async (id: string) => {
  const response = await axios.delete(`/api/events/${id}`);
  return response.data;
};
