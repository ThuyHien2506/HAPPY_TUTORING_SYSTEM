import React from 'react';
import './StyledTutorCard.css';

export default function StyledTutorCard({ tutor, onSelect }) {
  const img = tutor?.image || tutor?.avatar || '';
  const avatar = tutor?.avatar || '';
  return (
    <div className="background-border">
      <div className="container">
        <div className="link">
          <div className="course" style={{ backgroundImage: img ? `url(${img})` : undefined }} />
        </div>

        <div className="background">
          <div className="text-wrapper">{tutor?.code || 'CO3005'}</div>
        </div>
      </div>

      <div className="symbol">★★★★★</div>

      <div className="div">{tutor?.rating ? `${tutor.rating}` : '4.0'}</div>

      <div className="heading-link">
        <p className="nguy-n-l-ng-n-ng-l-p">{tutor?.title || tutor?.subjects?.[0] || 'Nguyên Lý Ngôn Ngữ Lập Trình'}</p>
      </div>

      <div className="paragraph-background">
        <div className="symbol-2">⏱</div>

        <div className="hk">{tutor?.hk || 'HK251'}</div>

        <div className="symbol-3">👥</div>

        <div className="text-wrapper-2">{`Students ${tutor?.students || '13/15'}`}</div>
      </div>

      <div className="image" style={{ backgroundImage: avatar ? `url(${avatar})` : undefined }} />

      <div className="text-wrapper-3">{tutor?.name || tutor?.tutorName || 'Nguyễn Thị B'}</div>

      <button className="link-2" onClick={() => onSelect && onSelect(tutor)}>
        <div className="text-wrapper-4">Enroll</div>
      </button>
    </div>
  );
}
