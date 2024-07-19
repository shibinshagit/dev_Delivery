
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
0%, 100% {
  opacity: 1;
}
50% {
  opacity: 0.5;
}
`;

// Create styled components with the pulse animation
export const SkeletonContainer = styled.div`
padding: 1rem;
display: flex;
flex-direction: column;
gap: 1rem;
`;

export const SkeletonItem = styled.div`
background-color: #e0e0e0;
border-radius: 0.375rem;
animation: ${pulse} 2s infinite;
`;

export const SkeletonTitle = styled(SkeletonItem)`
width: 33%;
height: 1.5rem;
`;

export const SkeletonSubtitle = styled(SkeletonItem)`
width: 25%;
height: 1rem;
`;

export const SkeletonParagraph = styled(SkeletonItem)`
height: 1rem;
`;

export const SkeletonImage = styled(SkeletonItem)`
width: 100%;
height: 12rem;
`;
