import { useEffect, useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ApiIcon from "@mui/icons-material/Api";
import LayersIcon from "@mui/icons-material/Layers";
import DomainIcon from "@mui/icons-material/Domain";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LockIcon from "@mui/icons-material/Lock";
import CategoryIcon from "@mui/icons-material/Category";
import { GetDashboardCount } from "../../libraries/Dashboard";

const ITEMS_PER_PAGE = 6;

export default function CountPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(0);
  const [dashboardCounts, setDashboardCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await GetDashboardCount();
        const counts = Array.isArray(res) ? res[0] : {};
        setDashboardCounts(counts);
      } catch (err) {
        console.error("Failed to fetch dashboard counts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const groupedItems = [
    {
      label: "Organizations",
      total: dashboardCounts.organization_count || 0,
      active: dashboardCounts.active_organization_count || 0,
      icon: <DomainIcon />,
      route: "/organizations",
    },
    {
      label: "Subscriptions",
      total: dashboardCounts.subscription_count || 0,
      active: dashboardCounts.active_subscription_count || 0,
      icon: <ListAltIcon />,
      route: "/subTier",
    },
    {
      label: "Subscription Tiers",
      total: dashboardCounts.subscription_tier_count || 0,
      active: dashboardCounts.active_subscription_tier_count || 0,
      icon: <LayersIcon />,
      route: "/subTier",
    },
    {
      label: "Resource Types",
      total: dashboardCounts.resource_type_count || 0,
      icon: <CategoryIcon />,
      route: "/resources",
    },
    {
      label: "API Endpoints",
      total: dashboardCounts.api_endpoint_count || 0,
      icon: <ApiIcon />,
      route: "/resources",
    },
    {
      label: "Permission Types",
      total: dashboardCounts.permission_type_count || 0,
      icon: <LockIcon />,
      route: "/permissions",
    },
  ];

  const totalPages = Math.ceil(groupedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = groupedItems.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const handlePrev = () => setPage((prev) => (prev > 0 ? prev - 1 : prev));
  const handleNext = () => setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));

  const handleSwipe = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0];
    const startX = touch.clientX;

    const onEnd = (endEvent: TouchEvent) => {
      const endX = endEvent.changedTouches[0].clientX;
      if (startX - endX > 50) handleNext();
      if (endX - startX > 50) handlePrev();
      document.removeEventListener("touchend", onEnd);
    };

    document.addEventListener("touchend", onEnd);
  };

  return (
    <Box
      ref={containerRef}
      onTouchStart={isMobile ? handleSwipe : undefined}
      sx={{
        height: "100%",
        width: "100%",
        position: "relative",
        padding: 1.5,
        boxSizing: "border-box",
        "&:hover .nav-arrow": { opacity: isMobile ? 0 : 1 },
      }}
    >
      {!isMobile && (
        <>
          <IconButton
            onClick={handlePrev}
            className="nav-arrow"
            sx={{
              position: "absolute",
              top: "calc(50% - 24px)",
              left: 4,
              backgroundColor: theme.palette.grey[200],
              "&:hover": { backgroundColor: theme.palette.grey[300] },
              opacity: 0,
              transition: "opacity 0.3s",
              zIndex: 1,
            }}
          >
            <ArrowBackIosNewIcon fontSize="large" />
          </IconButton>

          <IconButton
            onClick={handleNext}
            className="nav-arrow"
            sx={{
              position: "absolute",
              top: "calc(50% - 24px)",
              right: 4,
              backgroundColor: theme.palette.grey[200],
              "&:hover": { backgroundColor: theme.palette.grey[300] },
              opacity: 0,
              transition: "opacity 0.3s",
              zIndex: 1,
            }}
          >
            <ArrowForwardIosIcon fontSize="large" />
          </IconButton>
        </>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ height: "100%" }}>
          {paginatedItems.map((item) => (
            <Grid item xs={isMobile ? 6 : 4} key={item.label} sx={{ display: "flex" }}>
              <Tooltip
                title={
                  item.active !== undefined
                    ? `Active: ${item.active}, Inactive: ${item.total - item.active}`
                    : ""
                }
                arrow
              >
                <Card
                  onClick={() => navigate(item.route)}
                  sx={{
                    width: "100%",
                    height: isMobile ? "100%" : 120,
                    aspectRatio: isMobile ? "1 / 1" : undefined,
                    borderRadius: 3,
                    boxShadow: 4,
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.8,
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(6px)",
                        borderRadius: "50%",
                        padding: 1,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        color: theme.palette.primary.main,
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        color: theme.palette.text.primary,
                        fontSize: isMobile ? "1rem" : "1.1rem", // was 1.1 / 1.25
                      }}
                    >
                      {item.total}
                    </Typography>

                    {!isMobile && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontSize={11} // was 12
                        sx={{ fontWeight: 500 }}
                      >
                        {item.label}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      )}

      <Box display="flex" justifyContent="center" mt={2} gap={0.8}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                i === page ? theme.palette.primary.main : theme.palette.grey[400],
              transition: "background-color 0.2s",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}