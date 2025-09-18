

"use client";

import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { getUserData, updateUserData } from '@/services/firestore';

export interface StreakData {
    currentStreak: number;
    bestStreak: number;
    daysNotOpened: number;
}

const getGuestKey = (key: string) => `guest_${key}`;
const getTodayDateString = () => format(new Date(), 'yyyy-MM-dd');

/**
 * Calculates the user's current and best streak from their visit history.
 * This function is now private to this module.
 */
function calculateStreakData(visitHistory: string[]): StreakData {
    if (visitHistory.length === 0) {
        return { currentStreak: 0, bestStreak: 0, daysNotOpened: 0 };
    }
    
    const sortedDates = visitHistory.map(d => parseISO(d)).sort((a, b) => a.getTime() - b.getTime());
    
    let currentStreak = 0;
    let bestStreak = 0;

    if (sortedDates.length > 0) {
        const today = new Date();
        const lastVisit = sortedDates[sortedDates.length - 1];
        if (differenceInCalendarDays(today, lastVisit) <= 1) {
            currentStreak = 1;
            for (let i = sortedDates.length - 1; i > 0; i--) {
                const diff = differenceInCalendarDays(sortedDates[i], sortedDates[i - 1]);
                if (diff === 1) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }
        
        let longestStreak = 0;
        if (sortedDates.length > 0) {
            longestStreak = 1;
            let currentLongest = 1;
            for (let i = 1; i < sortedDates.length; i++) {
                if (differenceInCalendarDays(sortedDates[i], sortedDates[i-1]) === 1) {
                    currentLongest++;
                } else {
                    longestStreak = Math.max(longestStreak, currentLongest);
                    currentLongest = 1;
                }
            }
            bestStreak = Math.max(longestStreak, currentLongest, currentStreak);
        }
    }
    
    const daysNotOpened = differenceInCalendarDays(new Date(), sortedDates[sortedDates.length - 1]);

    return { currentStreak, bestStreak, daysNotOpened };
}

/**
 * Retrieves streak data for a user.
 * @param email - The user's email or null for guests.
 * @returns The user's streak data or default values if not available.
 */
export async function getStreakData(email: string | null): Promise<StreakData> {
    if (!email) {
        const key = getGuestKey('userVisitHistory');
        const historyStr = typeof window !== "undefined" ? localStorage.getItem(key) : null;
        let visitHistory: string[] = historyStr ? JSON.parse(historyStr) : [];
        return calculateStreakData(visitHistory);
    }
    try {
        const userData = await getUserData(email);
        return userData.streakData || { currentStreak: 0, bestStreak: 0, daysNotOpened: 0 };
    } catch (error) {
        console.error("Error getting streak data:", error);
        return { currentStreak: 0, bestStreak: 0, daysNotOpened: 0 };
    }
}


/**
 * Records a visit for the current day and updates streak data.
 * @param email - The user's email or null for guests.
 */
export async function recordVisit(email: string | null) {
    const today = getTodayDateString();
    
    if (!email) {
        const key = getGuestKey('userVisitHistory');
        const historyStr = localStorage.getItem(key);
        let visitHistory: string[] = historyStr ? JSON.parse(historyStr) : [];
        if (!visitHistory.includes(today)) {
            visitHistory = [...visitHistory, today].slice(-365);
            localStorage.setItem(key, JSON.stringify(visitHistory));
        }
        return;
    }
    
    try {
        const userData = await getUserData(email);
        const visitHistory: string[] = userData.userVisitHistory || [];
        
        if (!visitHistory.includes(today)) {
            const updatedHistory = [...visitHistory, today].slice(-365); // Keep last year of visits
            const newStreakData = calculateStreakData(updatedHistory);
            await updateUserData(email, { 
                userVisitHistory: updatedHistory,
                streakData: newStreakData
            });
        }
    } catch (error) {
        console.error("Error recording visit:", error);
    }
}
