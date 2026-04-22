import { HiArrowUp, HiArrowDown } from 'react-icons/hi';

const StatsCard = ({ icon, label, value, change, changeType, variant }) => {
    return (
        <div className={`stat-card ${variant}`}>
            <div className="stat-card-header">
                <div className={`stat-icon ${variant}`}>
                    {icon}
                </div>
                {change && (
                    <div className={`stat-change ${changeType}`}>
                        {changeType === 'up' ? <HiArrowUp size={14} /> : <HiArrowDown size={14} />}
                        {change}
                    </div>
                )}
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
};

export default StatsCard;   