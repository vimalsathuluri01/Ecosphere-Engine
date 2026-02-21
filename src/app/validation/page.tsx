import { Metadata } from 'next';
import ValidationClient from './client';

export const metadata: Metadata = {
    title: 'Validation & Robustness | Ecosphere Engine',
    description: 'Methodology Proofs, S-Curve Penalties, and Monte Carlo Robustness for Strong Sustainability.',
};

export default function ValidationEnginePage() {
    return <ValidationClient />;
}
