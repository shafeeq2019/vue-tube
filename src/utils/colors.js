// Marker colors for the categories, picked by position and repeated.
const CATEGORY_COLORS = ["#FF5A36", "#8B7CFF", "#3DD6C6", "#F2C14E", "#6FA8FF", "#E77BC4"];

export function categoryColor(index) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}
